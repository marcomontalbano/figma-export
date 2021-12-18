import * as FigmaExport from '@figma-export/types';

import { getClient } from './figma';
import { fetchStyles, parseStyles } from './figmaStyles';

export const styles: FigmaExport.StylesCommand = async ({
    token,
    fileId,
    version,
    outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    const client = getClient(token);

    log('fetching styles');
    const styleNodes = await fetchStyles(client, fileId, version);

    log('parsing styles');
    const parsedStyles = parseStyles(styleNodes);

    await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

    return parsedStyles;
};
