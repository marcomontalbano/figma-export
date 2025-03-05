/**
 * If you want to try this configuration you can just run:
 *   $ yarn
 *   $ yarn build
 *   $ npx tsx ./packages/cli/bin/run.js use-config ./.figmaexportrc.example.local.ts
 */

import path from 'node:path';

import type {
  ComponentsCommandOptions,
  FigmaExportRC,
  StylesCommandOptions,
} from './packages/types';

import outputComponentsAsEs6 from './packages/output-components-as-es6/dist/index';
import outputComponentsAsSvg from './packages/output-components-as-svg/dist/index';
import outputComponentsAsSvgr from './packages/output-components-as-svgr/dist/index';
import outputComponentsAsSvgstore from './packages/output-components-as-svgstore/dist/index';
import outputStylesAsCss from './packages/output-styles-as-css/dist/index';
import outputStylesAsLess from './packages/output-styles-as-less/dist/index';
import outputStylesAsSass from './packages/output-styles-as-sass/dist/index';
import outputStylesAsStyleDictionary from './packages/output-styles-as-style-dictionary/dist/index';
import transformSvgWithSvgo from './packages/transform-svg-with-svgo/dist/index';

const styleOptions: StylesCommandOptions = {
  fileId: 'fzYhvQpqwhZDUImRz431Qo',
  // onlyFromPages: ['icons'], // optional - Figma page names or IDs (all pages when not specified)
  outputters: [
    outputStylesAsCss({
      output: './output/styles/css',
    }),
    outputStylesAsLess({
      output: './output/styles/less',
    }),
    outputStylesAsSass({
      output: './output/styles/sass',
    }),
    outputStylesAsStyleDictionary({
      output: './output/styles/style-dictionary',
    }),
  ],
};

const componentOptions: ComponentsCommandOptions = {
  fileId: 'fzYhvQpqwhZDUImRz431Qo',
  onlyFromPages: ['icons', 'unit-test', 'icons/octicons-by-github'],
  // concurrency: 30,
  transformers: [
    transformSvgWithSvgo({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
        {
          name: 'removeDimensions',
        },
      ],
    }),
  ],
  outputters: [
    outputComponentsAsEs6({
      output: './output/components/es6',
      useBase64: true,
    }),
    outputComponentsAsSvg({
      output: './output/components/svg',
      getDirname: (options) => {
        const pathToComponent = options.pathToComponent
          .map((p) => p.name)
          .join(path.sep);
        return `${options.pageName}${path.sep}${options.dirname}${path.sep}${pathToComponent}`;
      },
    }),
    outputComponentsAsSvgr({
      output: './output/components/svgr',
      getSvgrConfig: () => ({
        template: ({ componentName, props, jsx, exports }, { tpl }) => tpl`
                    const ${componentName} = (${props}) => (${jsx});
                    ${exports}
                `,
      }),
    }),
    outputComponentsAsSvgstore({
      output: './output/components/svgstore',
      svgstoreConfig: {},
    }),
  ],
};

export default {
  commands: [
    ['styles', styleOptions],
    ['components', componentOptions],
  ],
} satisfies FigmaExportRC;
