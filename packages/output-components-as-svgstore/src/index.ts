/* eslint-disable import/order */

import svgstore from 'svgstore';

import type * as FigmaExport from '@figma-export/types';

import type { Options as SvgStoreOptions } from './svgstore.js';

import fs from 'node:fs';
import path from 'node:path';

type Options = {
  output: string;
  /** https://www.npmjs.com/package/svgstore#options */
  svgstoreConfig?: SvgStoreOptions;
  getIconId?: (options: FigmaExport.ComponentOutputterParamOption) => string;
};

export default ({
  output,
  getIconId = (options): string =>
    `${options.pageName}/${options.componentName}`,
  svgstoreConfig = {},
}: Options): FigmaExport.ComponentOutputter => {
  return async (pages): Promise<void> => {
    for (const { name: pageName, components } of pages) {
      const sprites = svgstore(svgstoreConfig);

      for (const { name: componentName, svg, figmaExport } of components) {
        const options = {
          pageName,
          componentName,
          ...figmaExport,
        };

        sprites.add(getIconId(options), svg);
      }

      const filePath = path.resolve(output, `${pageName}.svg`);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, sprites.toString({}));
    }
  };
};
