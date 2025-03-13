import type * as FigmaExport from '@figma-export/types';

import {
  enrichPagesWithSvg,
  getClient,
  getFile,
  getPagesWithComponents,
} from './figma.js';

export const components: FigmaExport.ComponentsCommand = async ({
  token,
  fileId,
  version,
  ids = [],
  onlyFromPages = [],
  filterComponent = () => true,
  includeTypes = ['COMPONENT'],
  transformers = [],
  outputters = [],
  concurrency = 30,
  retries = 3,
  log = (msg): void => {
    console.log(msg);
  },
}) => {
  const client = getClient(token);

  log('fetching document');
  const file = await getFile(client, { fileId, onlyFromPages, version, ids });

  if (client.hasError(file)) {
    throw new Error("'document' is missing.");
  }

  const pages = getPagesWithComponents(file, {
    filterComponent,
    includeTypes,
  });

  log('preparing components');
  const pagesWithSvg = await enrichPagesWithSvg(
    client,
    fileId,
    pages,
    version,
    {
      transformers,
      concurrency,
      retries,
      onFetchCompleted: ({ index, total }) => {
        log(`fetching components ${index}/${total}`);
      },
    },
  );

  await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

  log(`exported components from ${fileId}`);

  return pagesWithSvg;
};
