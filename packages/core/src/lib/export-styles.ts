import * as FigmaExport from '@figma-export/types';

import { getClient, getPageIds } from './figma';
import { fetchStyles, parseStyles } from './figmaStyles';

export const styles: FigmaExport.StylesCommand = async ({
    token,
    fileId,
    version,
    onlyFromPages = [],
    ids = [],
    outputters = [],
    log = (msg): void => {
        // eslint-disable-next-line no-console
        console.log(msg);
    },
}) => {
    if (onlyFromPages?.length && ids?.length) {
        throw new Error('\'onlyFromPages\' and \'ids\' are mutually exclusive.');
    }

    const client = getClient(token);

    log('fetching document');
    const {
        data: { document = null, version: documentVersion } = {},
    } = await client.file(fileId, { version, depth: 1 }).catch((error: Error) => {
        throw new Error(`while fetching file "${fileId}${version ? `?version=${version}` : ''}": ${error.message}`);
    });

    if (!document) {
        throw new Error('\'document\' is missing.');
    }

    const rootNodeIds = ids?.length ? ids : getPageIds(document, onlyFromPages);

    log('fetching styles');
    const styleNodes = await fetchStyles(client, fileId, documentVersion, rootNodeIds);

    log('parsing styles');
    const parsedStyles = parseStyles(styleNodes);

    await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

    log(`exported styles from ${fileId}`);

    return parsedStyles;
};
