// @ts-check

import outputComponentsAsSvg from '@figma-export/output-components-as-svg';
import outputStylesAsSass from '@figma-export/output-styles-as-sass';
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';

/** @type { import('@figma-export/types').StylesCommandOptions } */
const styleOptions = {
  fileId: 'fzYhvQpqwhZDUImRz431Qo',
  // version: 'xxx123456', // optional - file's version history is only supported on paid Figma plans
  // ids: ['138:52'], // optional - Export only specified node IDs (the `onlyFromPages` option is always ignored when set)
  // onlyFromPages: ['icons'], // optional - Figma page names or IDs (all pages when not specified)
  outputters: [
    outputStylesAsSass({
      output: './output',
    }),
  ],
};

/** @type { import('@figma-export/types').ComponentsCommandOptions } */
const componentOptions = {
  fileId: 'fzYhvQpqwhZDUImRz431Qo',
  // version: 'xxx123456', // optional - file's version history is only supported on paid Figma plans
  // ids: ['54:22'], // optional - Export only specified node IDs (the `onlyFromPages` option is always ignored when set)
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
          name: 'removeDimensions',
        },
      ],
    }),
  ],
  outputters: [
    outputComponentsAsSvg({
      output: './output',
    }),
  ],
};

/** @type { import('@figma-export/types').FigmaExportRC } */
export default {
  commands: [
    ['styles', styleOptions],
    ['components', componentOptions],
  ],
};
