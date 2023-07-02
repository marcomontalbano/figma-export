import * as Figma from 'figma-js';

import { basename, dirname } from 'path';
import pLimit from 'p-limit';
import pRetry from 'p-retry';
import * as FigmaExport from '@figma-export/types';

import {
    fetchAsSvgXml,
    promiseSequentially,
    fromEntries,
    chunk,
    emptySvg,
    notEmpty,
} from './utils';

const getComponentsInner = (
    children: readonly Figma.Node[] = [],
    filter: FigmaExport.ComponentFilter = () => true,
    pathToComponent: FigmaExport.ComponentExtras['pathToComponent'] = [],
): FigmaExport.ComponentNode[] => {
    let components: FigmaExport.ComponentNode[] = [];

    children.forEach((node) => {
        if (node.type === 'COMPONENT' && filter(node)) {
            components.push({
                ...node,
                svg: '',
                figmaExport: {
                    id: node.id,
                    dirname: dirname(node.name),
                    basename: basename(node.name),
                    pathToComponent,
                },
            });
            return;
        }

        if ('children' in node) {
            components = [
                ...components,
                ...getComponentsInner(
                    (node.children),
                    filter,
                    [...pathToComponent, { name: node.name, type: node.type }],
                ),
            ];
        }
    });

    return components;
};

const getComponents = (
    root: Figma.Node,
    filter: FigmaExport.ComponentFilter = () => true,
): FigmaExport.ComponentNode[] => {
    if (root.type !== 'COMPONENT' && 'children' in root) {
        return getComponentsInner(root.children, filter);
    }

    return getComponentsInner([root], filter);
};

const getPageIds = (document: Figma.Document, pageNames: string[]): string[] => {
    const only = pageNames.filter((p) => p.length);
    return document.children
        .filter((page) => only.length === 0 || only.includes(page.name))
        .map((canvas) => canvas.id);
};

const getIdsFromPages = (pages: FigmaExport.PageNode[]): string[] => pages.reduce((ids: string[], page) => [
    ...ids,
    ...page.components.map((component) => component.id),
], []);

const getClient = (token: string): Figma.ClientInterface => {
    if (!token) {
        throw new Error('\'Access Token\' is missing. https://www.figma.com/developers/docs#authentication');
    }

    return Figma.Client({ personalAccessToken: token });
};

const fileImages = async (
    client: Figma.ClientInterface,
    fileId: string,
    ids: string[],
    version?: string,
): Promise<{readonly [key: string]: string}> => {
    const response = await client.fileImages(fileId, {
        version,
        ids,
        format: 'svg',
        svg_include_id: true,
    }).catch((error: Error) => {
        throw new Error(`while fetching fileImages: ${error.message}`);
    });

    return response.data.images;
};

const getImages = async (
    client: Figma.ClientInterface,
    fileId: string,
    ids: string[],
    version?: string,
): Promise<{readonly [key: string]: string | null}> => {
    const idss = chunk(ids, 200);
    const limit = pLimit(30);

    const resolves = await Promise.all(idss.map((groupIds) => {
        return limit(() => fileImages(client, fileId, groupIds, version));
    }));

    return Object.assign({}, ...resolves);
};

type FigmaExportFileSvg = {
    [key: string]: string;
}

type FileSvgOptions = {
    transformers?: FigmaExport.StringTransformer[]
    concurrency?: number
    retries?: number
    onFetchCompleted?: (data: { index: number, total: number }) => void
}

const fileSvgs = async (
    client: Figma.ClientInterface,
    fileId: string,
    ids: string[],
    version: string | undefined,
    {
        concurrency = 30,
        retries = 3,
        transformers = [],
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onFetchCompleted = () => {},
    }: FileSvgOptions = {},
): Promise<FigmaExportFileSvg> => {
    const images = await getImages(client, fileId, ids, version);
    const limit = pLimit(concurrency);
    let index = 0;

    const svgPromises = Object.entries(images).filter(([, url]) => notEmpty(url)).map(async ([id, url]) => {
        if (url === null) {
            throw new Error('url is null');
        }

        const svg = await limit(
            () => pRetry(() => fetchAsSvgXml(url), { retries }),
        );
        const svgTransformed = await promiseSequentially(transformers, svg);

        onFetchCompleted({
            index: index += 1,
            total: ids.length,
        });

        return [id, svgTransformed];
    });

    const svgs = await Promise.all(svgPromises);

    return fromEntries(svgs);
};

const enrichNodesWithSvg = async (
    client: Figma.ClientInterface,
    fileId: string,
    pages: FigmaExport.PageNode[],
    svgOptions?: FileSvgOptions,
    version?: string,
): Promise<FigmaExport.PageNode[]> => {
    const componentIds = getIdsFromPages(pages);

    if (componentIds.length === 0) {
        throw new Error('No components found');
    }

    const svgs = await fileSvgs(client, fileId, componentIds, version, svgOptions);

    return pages.map((page) => ({
        ...page,
        components: page.components.map((component) => ({
            ...component,
            svg: svgs[component.id] || emptySvg,
        })),
    }));
};

export {
    getComponents,
    getPageIds,
    getClient,
    getImages,
    fileSvgs,
    enrichNodesWithSvg,
};
