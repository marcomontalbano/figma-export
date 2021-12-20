import * as FigmaExport from '@figma-export/types';

import { getClient, getPages, enrichPagesWithSvg } from './figma';

export const components: FigmaExport.ComponentsCommand = async ({
    token,
    fileId,
    version,
    onlyFromPages = [],
    transformers = [],
    outputters = [],
    concurrency = 30,
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    const client = getClient(token);

    log('fetching document');
    const { data: { document = null } = {} } = await client.file(fileId, { version }).catch((error: Error) => {
        throw new Error(`while fetching file "${fileId}${version ? `?version=${version}` : ''}": ${error.message}`);
    });

    if (!document) {
        throw new Error('\'document\' is missing.');
    }

    const pages = getPages((document), { only: onlyFromPages });

    log('preparing components');
    const pagesWithSvg = await enrichPagesWithSvg(client, fileId, pages, {
        transformers,
        concurrency,
        onFetchCompleted: ({ index, total }) => {
            log(`fetching components ${index}/${total}`);
        },
    });

    await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

    log(`exported components from ${fileId}`);

    return pagesWithSvg;
};
