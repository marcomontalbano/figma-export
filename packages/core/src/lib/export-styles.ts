import * as FigmaExport from '@figma-export/types';

import { getClient, getStyles } from './figma';
import { fetchStyles, parseStyles } from './figmaStyles';

export const styles: FigmaExport.StylesCommand = async ({
    token,
    fileId,
    version,
    ids = [],
    onlyFromPages = [],
    outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    const client = getClient(token);

    log('fetching document');
    const figmaStyles = await getStyles(
        client,
        {
            fileId,
            version,
            ids,
            onlyFromPages,
        },
    );

    log('fetching styles');
    const styleNodes = await fetchStyles(client, fileId, figmaStyles, version);

    log('parsing styles');
    const parsedStyles = parseStyles(styleNodes);

    await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

    log(`exported styles from ${fileId}`);

    return parsedStyles;
};
