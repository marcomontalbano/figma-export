import { FigmaExport } from '@figma-export/types/src';
import { Document } from 'figma-js';

import {
    getClient,
    getPages,
    enrichPagesWithSvg,
} from './figma';

type Options = {
    token: string;
    fileId: string;
    onlyFromPages?: string[];
    transformers?: Function[];
    outputters?: Function[];
    log?: (msg: string) => void;
}

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

    const pages = getPages((document as unknown as DocumentNode), { only: onlyFromPages });

    log('fetching components');
    const pagesWithSvg = await enrichPagesWithSvg(client, fileId, pages, transformers);

    await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

    return pagesWithSvg;
};
