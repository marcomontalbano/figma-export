import * as FigmaExport from '@figma-export/types';
import { Document } from 'figma-js';

import { getClient, getPages, enrichPagesWithSvg } from './figma';

type Options = FigmaExport.BaseCommandOptions & FigmaExport.ComponentsCommandOptions;

export const components = async ({
    token,
    fileId,
    onlyFromPages = [],
    transformers = [],
    outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}: Options): Promise<FigmaExport.PageNode[]> => {
    const client = getClient(token);

    log('fetching document');
    const { data: { document } = {} }: { data?: { document?: Document } } = await client.file(fileId);

    if (!document) {
        throw new Error('\'document\' is missing.');
    }

    const pages = getPages((document), { only: onlyFromPages });

    log('fetching components');
    const pagesWithSvg = await enrichPagesWithSvg(client, fileId, pages, transformers);

    await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

    return pagesWithSvg;
};
