import type * as Figma from '@figma/rest-api-spec';
import type * as FigmaExport from '@figma-export/types';
import type * as FigmaSDK from '../client.js';

import { notNullish } from '../utils.js';

import { parse as parseEffectStyle } from './effectStyle.js';
import { parse as parsePaintStyle } from './paintStyle.js';
import { parse as parseTextStyle } from './textStyle.js';

// import { parse as parseGridStyle } from './gridStyle.js';

const fetchStyles = async (
  client: FigmaSDK.ClientInterface,
  fileId: string,
  styles: { readonly [key: string]: Figma.Style },
  version?: string,
): Promise<FigmaExport.StyleNode[]> => {
  const styleIds = Object.keys(styles);

  if (styleIds.length === 0) {
    throw new Error('No styles found');
  }

  const response = await client
    .getFileNodes({ file_key: fileId }, { ids: styleIds.join(','), version })
    .catch((error: Error) => {
      throw new Error(
        `while fetching fileNodes: ${'cause' in error ? error.cause : error.message}`,
      );
    });

  if (client.hasError(response)) {
    throw new Error("'fileNodes' are missing.");
  }

  const styleNodes = Object.values(response.nodes).map(
    (node) => node?.document,
  );

  return styleNodes.map((node) => ({
    ...(node ? styles[node.id] : ({} as Figma.Style)),
    ...(node as Figma.Node),
  }));
};

const parseStyles = (
  styleNodes: FigmaExport.StyleNode[],
): FigmaExport.Style[] => {
  return styleNodes
    .map((node) => {
      // const parsedStyles = parsePaintStyle(node) ?? parseEffectStyle(node) ?? parseTextStyle(node) ?? parseGridStyle(node);
      const parsedStyles =
        parsePaintStyle(node) ?? parseEffectStyle(node) ?? parseTextStyle(node);

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
    })
    .filter(notNullish);
};

export { fetchStyles, parseStyles };
