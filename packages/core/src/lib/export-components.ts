import * as FigmaExport from '@figma-export/types';

import {
    getClient, getPageIds, enrichNodesWithSvg, getComponents,
} from './figma';

import { notEmpty } from './utils';

export const components: FigmaExport.ComponentsCommand = async ({
    token,
    fileId,
    version,
    onlyFromPages = [],
    ids = [],
    filterComponent = () => true,
    transformers = [],
    outputters = [],
    concurrency = 30,
    retries = 3,
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    if (onlyFromPages?.length && ids?.length) {
        throw new Error('\'onlyFromPages\' and \'ids\' are mutually exclusive.');
    }

    const client = getClient(token);

    log('fetching document');
    const {
        data: { document = null, version: documentVersion } = {},
    } = await client.file(fileId, { version, depth: 1 }).catch((error: Error) => {
        throw new Error(`while fetching file "${fileId}${version ? `?version=${version}` : ''}": ${error.message}`);
    });

    if (!document) {
        throw new Error('\'document\' is missing.');
    }

    const rootNodeIds = ids?.length ? ids : getPageIds(document, onlyFromPages);

    const { data: fileNodesResponse } = await client.fileNodes(fileId, { ids: rootNodeIds, version: documentVersion });

    const rootNodes = Object.values(fileNodesResponse.nodes)
        .filter(notEmpty)
        .map((node): FigmaExport.PageNode => ({
            ...node.document,
            components: getComponents(node.document, filterComponent),
        }))
        .filter((page) => page.components.length > 0);

    if (!rootNodes) {
        throw new Error('nodes list is empty');
    }

    log('preparing components');
    const pagesWithSvg = await enrichNodesWithSvg(client, fileId, rootNodes, {
        transformers,
        concurrency,
        retries,
        onFetchCompleted: ({ index, total }) => {
            log(`fetching components ${index}/${total}`);
        },
    }, documentVersion);

    await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

    log(`exported components from ${fileId}`);

    return pagesWithSvg;
};
