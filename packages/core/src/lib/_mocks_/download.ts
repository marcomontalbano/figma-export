import { writeFileSync } from 'node:fs';
import { sep } from 'node:path';
import type * as Figma from '@figma/rest-api-spec';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const { FIGMA_TOKEN } = process.env;

  if (!FIGMA_TOKEN) {
    throw new Error('FIGMA_TOKEN is not defined');
  }

  const doFetch = async <
    T extends Figma.GetFileResponse | Figma.GetFileNodesResponse,
  >(
    url: string,
  ) =>
    await fetch(url, {
      headers: { 'X-FIGMA-TOKEN': FIGMA_TOKEN },
    }).then<T>((response) => response.json() as Promise<T>);

  const figmaFiles: Figma.GetFileResponse = await doFetch(
    'https://api.figma.com/v1/files/fzYhvQpqwhZDUImRz431Qo',
  );

  const nodes = Object.keys(figmaFiles.styles);

  const figmaFileNodes: Figma.GetFileNodesResponse = await doFetch(
    `https://api.figma.com/v1/files/fzYhvQpqwhZDUImRz431Qo/nodes?ids=${nodes.join(',')}`,
  );

  writeFileSync(
    `${__dirname}${sep}figma.files.json`,
    JSON.stringify(figmaFiles, undefined, 4),
  );
  writeFileSync(
    `${__dirname}${sep}figma.fileNodes.json`,
    JSON.stringify(figmaFileNodes, undefined, 4),
  );
})();
