import * as FigmaExport from '@figma-export/types';

import { getClient } from './figma';
import { fetchStyles, parseStyles } from './figmaStyles';

type Options = FigmaExport.BaseCommandOptions & FigmaExport.StylesCommandOptions;

export const styles = async ({
    token,
    fileId,
    outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}: Options): Promise<FigmaExport.Style[]> => {
    const client = getClient(token);

    log('fetching styles');
    const styleNodes = await fetchStyles(client, fileId);

    log('parsing styles');
    const parsedStyles = parseStyles(styleNodes);

    await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

    return parsedStyles;
};
