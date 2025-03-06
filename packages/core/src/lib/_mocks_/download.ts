import { writeFileSync } from 'node:fs';
import { sep } from 'node:path';
import axios from 'axios';
import type * as Figma from 'figma-js';

(async () => {
  const { FIGMA_TOKEN } = process.env;

  if (!FIGMA_TOKEN) {
    throw new Error('FIGMA_TOKEN is not defined');
  }

  const fetch = async (url: string) =>
    (
      await axios.get(url, {
        headers: { 'X-FIGMA-TOKEN': FIGMA_TOKEN },
      })
    ).data;

  const figmaFiles: Figma.FileResponse = await fetch(
    'https://api.figma.com/v1/files/fzYhvQpqwhZDUImRz431Qo',
  );

  const nodes = Object.keys(figmaFiles.styles);

  const figmaFileNodes: Figma.FileNodesResponse = await fetch(
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
