import type * as FigmaExport from '@figma-export/types';

import fs from 'node:fs';
import path from 'node:path';

type Options = {
  output: string;
  getDirname?: (options: FigmaExport.ComponentOutputterParamOption) => string;
  getBasename?: (options: FigmaExport.ComponentOutputterParamOption) => string;
};

export default ({
  output,
  getDirname = (options): string =>
    `${options.pageName}${path.sep}${options.dirname}`,
  getBasename = (options): string => `${options.basename}.svg`,
}: Options): FigmaExport.ComponentOutputter => {
  return async (pages): Promise<void> => {
    for (const { name: pageName, components } of pages) {
      for (const { name: componentName, svg, figmaExport } of components) {
        const options = {
          pageName,
          componentName,
          ...figmaExport,
        };

        const filePath = path.resolve(output, getDirname(options));

        fs.mkdirSync(filePath, { recursive: true });
        fs.writeFileSync(path.resolve(filePath, getBasename(options)), svg);
      }
    }
  };
};
