import type * as FigmaExport from '@figma-export/types';

import { getClient, getFile } from './figma.js';
import { fetchStyles, parseStyles } from './figmaStyles/index.js';

export const styles: FigmaExport.StylesCommand = async ({
  token,
  fileId,
  version,
  ids = [],
  onlyFromPages = [],
  outputters = [],
  log = (msg): void => {
    console.log(msg);
  },
}) => {
  const client = getClient(token, log);

  log('fetching document');
  const file = await getFile(client, { fileId, onlyFromPages, version, ids });

  if (client.hasError(file)) {
    throw new Error("'styles' are missing.");
  }

  log('fetching styles');
  const styleNodes = await fetchStyles(client, fileId, file.styles, version);

  log('parsing styles');
  const parsedStyles = parseStyles(styleNodes);

  await Promise.all(outputters.map((outputter) => outputter(parsedStyles)));

  log(`exported styles from ${fileId}`);

  return parsedStyles;
};
