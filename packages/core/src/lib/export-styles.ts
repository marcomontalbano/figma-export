import { FigmaExport } from '@figma-export/types';

import {
    getClient, fetchStyles,
} from './figma';

type Options = {
    token: string;
    fileId: string;
    onlyFromPages?: string[];
    transformers?: FigmaExport.StringTransformer[];
    outputters?: FigmaExport.Outputter[];
    log?: (msg: string) => void;
}

export const styles = async ({
    token,
    fileId,
    // transformers = [],
    // outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}: Options): Promise<number[]> => {
    const client = getClient(token);

    log('fetching styles');
    const styleNodes = await fetchStyles(client, fileId);
    console.log(styleNodes);

    log('parsing styles');
    // TODO: convert figma Styles to CSS Like
    // const parsedStyles = await parseFigmaStyles(styleNodes, transformers);

    // TODO: send the parsed style to outputter
    // await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

    return [];
};
