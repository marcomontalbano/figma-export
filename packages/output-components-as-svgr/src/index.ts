import type * as FigmaExport from '@figma-export/types';
import { pascalCase } from '@figma-export/utils';
import { type Config, type State, transform } from '@svgr/core';

import fs from 'node:fs';
import path from 'node:path';

type Options = {
  output: string;
  getDirname?: (options: FigmaExport.ComponentOutputterParamOption) => string;
  getComponentName?: (
    options: FigmaExport.ComponentOutputterParamOption,
  ) => string;
  getComponentFilename?: (
    options: FigmaExport.ComponentOutputterParamOption,
  ) => string;
  getFileExtension?: (
    options: FigmaExport.ComponentOutputterParamOption,
  ) => string;
  getExportTemplate?: (
    options: FigmaExport.ComponentOutputterParamOption,
  ) => string;

  /**
   * SVGR ships with a handful of customizable options, usable in both the CLI and API.
   * https://react-svgr.com/docs/options/
   */
  getSvgrConfig?: (
    options: FigmaExport.ComponentOutputterParamOption,
  ) => Config;
};

type IndexFile = {
  [key: string]: {
    exports: string[];
    ext: string;
  };
};

export default ({
  output,
  getDirname = (options): string =>
    `${options.pageName}${path.sep}${options.dirname}`,
  getComponentName = (options): string => `${pascalCase(options.basename)}`,
  getComponentFilename = (options): string => `${getComponentName(options)}`,
  getFileExtension = (): string => '.jsx',
  getSvgrConfig = (): Config => ({}),
  getExportTemplate = (options): string => {
    const reactComponentName = getComponentName(options);
    const reactComponentFilename = `${getComponentFilename(options)}${getFileExtension(options)}`;
    return `export { default as ${reactComponentName} } from './${reactComponentFilename}';`;
  },
}: Options): FigmaExport.ComponentOutputter => {
  const indexFile: IndexFile = {};
  return async (pages): Promise<void> => {
    for (const { name: pageName, components } of pages) {
      for (const { name: componentName, svg, figmaExport } of components) {
        const options = {
          pageName,
          componentName,
          ...figmaExport,
        };

        const reactComponentName = getComponentName(options);
        const reactComponentFilename = `${getComponentFilename(options)}${getFileExtension(options)}`;
        const filePath = path.resolve(output, getDirname(options));

        fs.mkdirSync(filePath, { recursive: true });

        indexFile[filePath] = indexFile[filePath] || {
          ext: getFileExtension(options) === '.tsx' ? '.ts' : '.js',
          exports: [],
        };
        indexFile[filePath].exports.push(getExportTemplate(options));

        const svgrConfig = getSvgrConfig(options);
        const svgrState: State = { componentName: reactComponentName };

        const jsCode = transform.sync(svg, svgrConfig, svgrState);

        fs.writeFileSync(
          path.resolve(filePath, reactComponentFilename),
          jsCode,
        );
      }

      for (const [filePath, index] of Object.entries(indexFile)) {
        fs.writeFileSync(
          path.resolve(filePath, `index${index.ext}`),
          index.exports.join('\n'),
        );
      }
    }
  };
};
