import * as Figma from 'figma-js';

import { basename, dirname } from 'path';
import pLimit from 'p-limit';
import pRetry from 'p-retry';
import * as FigmaExport from '@figma-export/types';

import {
    toArray,
    fetchAsSvgXml,
    promiseSequentially,
    fromEntries,
    chunk,
    emptySvg,
} from './utils';

export const getComponents = (
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
                ...getComponents(
                    (node.children),
                    filter,
                    [...pathToComponent, { name: node.name, type: node.type }],
                ),
            ];
        }
    });

    return components;
};

/** Check whether the given string is not empty. */
function isNotEmpty(input: string): boolean {
    return input.trim() !== '';
}

export const getPages = (document: Figma.Document, pageNames: string | string[] = []): Figma.Canvas[] => {
    const only = toArray(pageNames).filter(isNotEmpty);
    return document.children
        .filter((node): node is Figma.Canvas => {
            return node.type === 'CANVAS' && (only.length === 0 || only.includes(node.name));
        });
};

type GetPagesOptions = {
    only?: string | string[];
    filter?: FigmaExport.ComponentFilter;
}

export const getPagesWithComponents = (document: Figma.Document, options: GetPagesOptions = {}): FigmaExport.PageNode[] => {
    const pages = getPages(document, options.only);

    return pages
        .map((page) => ({
            ...page,
            components: getComponents(page.children as readonly FigmaExport.ComponentNode[], options.filter),
        }))
        .filter((page) => page.components.length > 0);
};

export const getIdsFromPages = (pages: FigmaExport.PageNode[]): string[] => pages.reduce((ids: string[], page) => [
    ...ids,
    ...page.components.map((component) => component.id),
], []);

export const getClient = (token: string): Figma.ClientInterface => {
    if (!token) {
        throw new Error('\'Access Token\' is missing. https://www.figma.com/developers/docs#authentication');
    }

    return Figma.Client({ personalAccessToken: token });
};

const fileImages = async (client: Figma.ClientInterface, fileId: string, ids: string[]) => {
    const response = await client.fileImages(fileId, {
        ids,
        format: 'svg',
        svg_include_id: true,
    }).catch((error: Error) => {
        throw new Error(`while fetching fileImages: ${error.message}`);
    });

    return response.data.images;
};

export const getImages = async (client: Figma.ClientInterface, fileId: string, ids: string[]) => {
    const idss = chunk(ids, 200);
    const limit = pLimit(30);

    const resolves = await Promise.all(idss.map((groupIds) => {
        return limit(() => fileImages(client, fileId, groupIds));
    }));

    return Object.assign({}, ...resolves) as typeof resolves[number];
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

export const fileSvgs = async (
    client: Figma.ClientInterface,
    fileId: string,
    ids: string[],
    {
        concurrency = 30,
        retries = 3,
        transformers = [],
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onFetchCompleted = () => {},
    }: FileSvgOptions = {},
): Promise<FigmaExportFileSvg> => {
    const images = await getImages(client, fileId, ids);
    const limit = pLimit(concurrency);
    let index = 0;
    const svgPromises = Object.entries(images).map(async ([id, url]) => {
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

export const enrichPagesWithSvg = async (
    client: Figma.ClientInterface,
    fileId: string,
    pages: FigmaExport.PageNode[],
    svgOptions?: FileSvgOptions,
): Promise<FigmaExport.PageNode[]> => {
    const componentIds = getIdsFromPages(pages);

    if (componentIds.length === 0) {
        throw new Error('No components found');
    }

    const svgs = await fileSvgs(client, fileId, componentIds, svgOptions);

    return pages.map((page) => ({
        ...page,
        components: page.components.map((component) => ({
            ...component,
            svg: svgs[component.id] || emptySvg,
        })),
    }));
};
