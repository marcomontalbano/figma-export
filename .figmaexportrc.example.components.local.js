// @ts-check

/**
 * If you want to try this configuration you can just run:
 *   $ yarn
 *   $ yarn build
 *   $ node ./packages/cli/bin/run.js use-config .figmaexportrc.example.components.local.js
 */

import path from 'node:path';
import { inspect } from 'node:util';

import outputComponentsAsSvg from './packages/output-components-as-svg/dist/index.js';

/** @type {import('./packages/types').ComponentsCommandOptions} */
const componentOptions = {
  fileId: 'WnaqeyvNBhSbnBs0t1Fgvm',
  filterComponent: () => true,
  includeTypes: ['COMPONENT', 'INSTANCE'],
  outputters: [
    async (pages) => {
      console.log(
        '\n components:',
        pages[0].components.length,
        inspect(pages[0].components, { depth: null, colors: true }),
      );
    },
    outputComponentsAsSvg({
      output: './output/components/svg',
      getDirname: (options) => {
        const pathToComponent = options.pathToComponent
          .map((p) => p.name)
          .join(path.sep);
        return `${options.pageName}${path.sep}${options.dirname}${path.sep}${pathToComponent}`;
      },
    }),
  ],
};

/** @type {import('./packages/types').FigmaExportRC} */
export default {
  commands: [['components', componentOptions]],
};
