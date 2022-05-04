import * as FigmaExport from '@figma-export/types';

import { getClient } from './figma';
import { fetchStyles, parseStyles } from './figmaStyles';

export const styles: FigmaExport.StylesCommand = async ({
    token,
    fileId,
    version,
    nodeIds,
    outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    const client = getClient(token);

    log('fetching styles');
    const styleNodes = await fetchStyles(client, fileId, version, nodeIds);

    log('parsing styles');
    const parsedStyles = parseStyles(styleNodes);

    await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

    log(`exported styles from ${fileId}`);

    return parsedStyles;
};
