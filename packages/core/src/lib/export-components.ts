import { FigmaExport } from '@figma-export/types/src';
import { Document } from 'figma-js';

import {
    getClient,
    getPages,
    enrichPagesWithSvg,
} from './figma';

type FigmaExportComponentsProps = {
    [key: string]: any;
    token: string;
}

export const components = async ({
    token,
    fileId,
    onlyFromPages = [],
    transformers = [],
    outputters = [],
    log = (msg: string): void => { console.log(msg); },
}: FigmaExportComponentsProps): Promise<FigmaExport.PageNode[]> => {
    const client = getClient(token);

    log('fetching document');
    const { data: { document } = {} }: { data?: { document?: Document } } = await client.file(fileId);

    const pages = getPages((document as unknown as DocumentNode), { only: onlyFromPages });

    log('fetching components');
    const pagesWithSvg = await enrichPagesWithSvg(client, fileId, pages, transformers);

    await Promise.all(outputters.map((outputter: Function) => outputter(pagesWithSvg)));

    return pagesWithSvg;
};
