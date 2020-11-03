import axios from 'axios';
import * as Figma from 'figma-js';
import { writeFileSync } from 'fs';
import { sep } from 'path';

(async () => {
    const fetch = async (url: string) => (await axios.get(url, {
        headers: { 'X-FIGMA-TOKEN': process.env.FIGMA_TOKEN },
    })).data;

    const figmaFiles: Figma.FileResponse = await fetch(
        'https://api.figma.com/v1/files/fzYhvQpqwhZDUImRz431Qo',
    );

    const nodes = Object.keys(figmaFiles.styles);

    const figmaFileNodes: Figma.FileNodesResponse = await fetch(
        `https://api.figma.com/v1/files/fzYhvQpqwhZDUImRz431Qo/nodes?ids=${nodes.join(',')}`,
    );

    writeFileSync(`${__dirname}${sep}figma.files.json`, JSON.stringify(figmaFiles, undefined, 4));
    writeFileSync(`${__dirname}${sep}figma.fileNodes.json`, JSON.stringify(figmaFileNodes, undefined, 4));
})();
