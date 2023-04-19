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

function isGroupingNode(value: Figma.NodeType): value is 'GROUP' | 'FRAME' {
    const GROUPING_NODES = ['GROUP', 'FRAME'];
    return GROUPING_NODES.includes(value);
}

const getComponents = (
    children: readonly Figma.Node[] = [],
    filter: FigmaExport.ComponentFilter = () => true,
    groupingPath: FigmaExport.GroupingPath[] = [],
): FigmaExport.ComponentNode[] => {
    let components: FigmaExport.ComponentNode[] = [];

    children.forEach((node) => {
        if (node.type === 'COMPONENT' && filter(node)) {
            components.push({
                ...node,
                groupingPath,
                svg: '',
                figmaExport: {
                    id: node.id,
                    dirname: dirname(node.name),
                    basename: basename(node.name),
                },
            });
            return;
        }

        if ('children' in node) {
            const thisFrameName: FigmaExport.GroupingPath[] = groupingPath;
            if (isGroupingNode(node.type)) {
                thisFrameName.push({ name: node.name, type: node.type });
            }

            components = [
                ...components,
                ...getComponents((node.children), filter, thisFrameName),
            ];
        }
    });

    return components;
};

const filterPagesByName = (pages: readonly Figma.Canvas[], pageNames: string | string[] = []): Figma.Canvas[] => {
    const only = toArray(pageNames).filter((p) => p.length);
    return pages.filter((page) => only.length === 0 || only.includes(page.name));
};

type GetPagesOptions = {
    only?: string | string[];
    filter?: FigmaExport.ComponentFilter;
}

const getPages = (document: Figma.Document, options: GetPagesOptions = {}): FigmaExport.PageNode[] => {
    const pages = filterPagesByName(document.children as Figma.Canvas[], options.only);

    return pages
        .map((page) => ({
            ...page,
            components: getComponents(page.children as readonly FigmaExport.ComponentNode[], options.filter),
        }))
        .filter((page) => page.components.length > 0);
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

const fileImages = async (client: Figma.ClientInterface, fileId: string, ids: string[]): Promise<{readonly [key: string]: string}> => {
    const response = await client.fileImages(fileId, {
        ids,
        format: 'svg',
        svg_include_id: true,
    }).catch((error: Error) => {
        throw new Error(`while fetching fileImages: ${error.message}`);
    });

    return response.data.images;
};

const getImages = async (client: Figma.ClientInterface, fileId: string, ids: string[]): Promise<{readonly [key: string]: string}> => {
    const idss = chunk(ids, 200);
    const limit = pLimit(30);

    const resolves = await Promise.all(idss.map((groupIds) => {
        return limit(() => fileImages(client, fileId, groupIds));
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

const enrichPagesWithSvg = async (
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

export {
    getComponents,
    getPages,
    getIdsFromPages,
    getClient,
    getImages,
    fileSvgs,
    enrichPagesWithSvg,
};
