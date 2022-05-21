import * as FigmaExport from '@figma-export/types';

import { getClient, getPages } from './figma';
import { fetchStyles, parseStyles } from './figmaStyles';

export const styles: FigmaExport.StylesCommand = async ({
    token,
    fileId,
    version,
    onlyFromPages = [],
    outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    const client = getClient(token);

    log('fetching document');
    const { data: { document = null } = {} } = await client.file(fileId, { version, depth: 1 }).catch((error: Error) => {
        throw new Error(`while fetching file "${fileId}${version ? `?version=${version}` : ''}": ${error.message}`);
    });

    if (!document) {
        throw new Error('\'document\' is missing.');
    }

    const ids = getPages((document), { only: onlyFromPages })
        .map((page) => page.id);

    log('fetching styles');
    const styleNodes = await fetchStyles(client, fileId, version, ids);

    log('parsing styles');
    const parsedStyles = parseStyles(styleNodes);

    await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

    log(`exported styles from ${fileId}`);

    return parsedStyles;
};
