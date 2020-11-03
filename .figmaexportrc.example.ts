/**
 * If you want to try this configuration you can just run:
 *   $ npm install --save-dev typescript ts-node @types/node @figma-export/types
 *   $ npm install --save-dev @figma-export/output-styles-as-sass @figma-export/transform-svg-with-svgo @figma-export/output-components-as-svg @figma-export/output-components-as-es6
 */

import { FigmaExportRC, StylesCommandOptions, ComponentsCommandOptions } from '@figma-export/types';

import outputStylesAsSass from '@figma-export/output-styles-as-sass';
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';
import outputComponentsAsSvg from '@figma-export/output-components-as-svg';
import outputComponentsAsEs6 from '@figma-export/output-components-as-es6';

const styleOptions: StylesCommandOptions = {
    fileId: 'fzYhvQpqwhZDUImRz431Qo',
    outputters: [
        outputStylesAsSass({
            output: './output'
        })
    ]
};

const componentOptions: ComponentsCommandOptions = {
    fileId: 'fzYhvQpqwhZDUImRz431Qo',
    onlyFromPages: ['icons'],
    transformers: [
        transformSvgWithSvgo({
            plugins: [
                { removeViewBox: false },
                { removeDimensions: true }
            ]
        })
    ],
    outputters: [
        outputComponentsAsSvg({
            output: './output'
        }),
        outputComponentsAsEs6({
            output: './output'
        })
    ]
};

(module.exports as FigmaExportRC) = {
    commands: [
        ['styles', styleOptions],
        ['components', componentOptions]
    ]
};
