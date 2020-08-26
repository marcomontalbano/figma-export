import * as Figma from 'figma-js';
import * as FigmaExport from '@figma-export/types';

import { notEmpty } from '../utils';

import { parse as parsePaintStyle } from './paintStyle';
import { parse as parseEffectStyle } from './effectStyle';
import { parse as parseTextStyle } from './textStyle';
// import { parse as parseGridStyle } from './gridStyle';

const fetchStyles = async (client: Figma.ClientInterface, fileId: string): Promise<FigmaExport.StyleNode[]> => {
    const { data: { styles } = {} } = await client.file(fileId);

    if (!styles) {
        throw new Error('\'styles\' are missing.');
    }

    const { data: { nodes } } = await client.fileNodes(fileId, { ids: Object.keys(styles) });

    const styleNodes = Object.values(nodes).map((node) => node?.document);

    return styleNodes.map((node) => ({
        ...(node ? styles[node.id] : ({} as Figma.Style)),
        ...(node as Figma.Node),
    }));
};

const parseStyles = (styleNodes: FigmaExport.StyleNode[]): FigmaExport.Style[] => {
    return styleNodes.map((node) => {
        const parsedStyles = undefined
            || parsePaintStyle(node)
            || parseEffectStyle(node)
            || parseTextStyle(node);
            // || parseGridStyle(node)

        if (!parsedStyles) {
            return undefined;
        }

        return {
            name: node.name,
            comment: node.description,
            visible: node.visible !== false,
            originalNode: node,
            ...parsedStyles,
        };
    }).filter(notEmpty);
};

export {
    fetchStyles,
    parseStyles,
};
