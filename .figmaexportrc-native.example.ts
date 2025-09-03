/**
 * If you want to try this configuration you can just run:
 *   $ npm install --save-dev typescript ts-node @types/node @figma-export/types
 *   $ npm install --save-dev @figma-export/transform-svg-with-svgo @figma-export/output-components-as-svgr
 *   $ npm install --save-dev @svgr/plugin-svgo @svgr/plugin-jsx @svgr/plugin-prettier
 * */

import transformSvgWithSvgr from '@figma-export/output-components-as-svgr';
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';
import type {
  ComponentsCommandOptions,
  FigmaExportRC,
} from '@figma-export/types';

const componentOptions: ComponentsCommandOptions = {
  fileId: 'fzYhvQpqwhZDUImRz431Qo',
  // version: 'xxx123456', // optional - file's version history is only supported on paid Figma plans
  onlyFromPages: ['icons'],
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
          name: 'removeXMLNS',
        },
      ],
    }),
  ],
  outputters: [
    transformSvgWithSvgr({
      output: './output',
      getFileExtension: () => '.tsx',
      getSvgrConfig: () => ({
        expandProps: 'end',
        icon: true,
        native: true,
        plugins: [
          '@svgr/plugin-svgo',
          '@svgr/plugin-jsx',
          '@svgr/plugin-prettier',
        ],
        template: ({ componentName, props, jsx, exports }, { tpl }) => tpl`
                    const ${componentName} = (${props}) => (${jsx});
                    ${exports}
                `,
        typescript: true,
      }),
    }),
  ],
};

export default {
  commands: [['components', componentOptions]],
} satisfies FigmaExportRC;
