import { FigmaExportRC, StylesCommandOptions, ComponentsCommandOptions } from '@figma-export/types';

import outputStylesAsSass from '@figma-export/output-styles-as-sass';
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';
import outputComponentsAsSvg from '@figma-export/output-components-as-svg';
import outputComponentsAsEs6 from '@figma-export/output-components-as-es6';

const styleOptions: StylesCommandOptions = {
    fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
    outputters: [
        outputStylesAsSass({
            output: './output'
        })
    ]
};

const componentOptions: ComponentsCommandOptions = {
    fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
    onlyFromPages: ['icons', 'monochrome'],
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
