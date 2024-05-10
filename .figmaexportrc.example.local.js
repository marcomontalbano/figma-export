// @ts-check

/**
 * If you want to try this configuration you can just run:
 *   $ yarn
 *   $ yarn build
 *   $ node ./packages/cli/bin/run.js use-config .figmaexportrc.example.local.js
 */

import path from 'path';

import outputStylesAsCss from './packages/output-styles-as-css/dist/index.js';
import outputStylesAsLess from './packages/output-styles-as-less/dist/index.js';
import outputStylesAsSass from './packages/output-styles-as-sass/dist/index.js';
import outputStylesAsStyleDictionary from './packages/output-styles-as-style-dictionary/dist/index.js';
import transformSvgWithSvgo from './packages/transform-svg-with-svgo/dist/index.js';
import outputComponentsAsEs6 from './packages/output-components-as-es6/dist/index.js';
import outputComponentsAsSvg from './packages/output-components-as-svg/dist/index.js';
import outputComponentsAsSvgr from './packages/output-components-as-svgr/dist/index.js';
import outputComponentsAsSvgstore from './packages/output-components-as-svgstore/dist/index.js';

/** @type {import('./packages/types').StylesCommandOptions} */
const styleOptions = {
    fileId: 'fzYhvQpqwhZDUImRz431Qo',
    // onlyFromPages: ['icons'], // optional - Figma page names or IDs (all pages when not specified)
    outputters: [
        outputStylesAsCss({
            output: './output/styles/css'
        }),
        outputStylesAsLess({
            output: './output/styles/less'
        }),
        outputStylesAsSass({
            output: './output/styles/sass'
        }),
        outputStylesAsStyleDictionary({
            output: './output/styles/style-dictionary'
        })
    ]
};

/** @type {import('./packages/types').ComponentsCommandOptions} */
const componentOptions = {
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
                        }
                    }
                },
                {
                    name: 'removeDimensions'
                }
            ]
        })
    ],
    outputters: [
        outputComponentsAsEs6({
            output: './output/components/es6',
            useBase64: true,
        }),
        outputComponentsAsSvg({
            output: './output/components/svg',
            getDirname: (options) => {
                const pathToComponent = options.pathToComponent.map(p => p.name).join(path.sep)
                return `${options.pageName}${path.sep}${options.dirname}${path.sep}${pathToComponent}`
            },
        }),
        outputComponentsAsSvgr({
            output: './output/components/svgr',
            getSvgrConfig: () => ({
                template: ({ componentName, props, jsx, exports }, { tpl }) => tpl`
                    const ${componentName} = (${props}) => (${jsx});
                    ${exports}
                `
            })
        }),
        outputComponentsAsSvgstore({
            output: './output/components/svgstore',
            svgstoreConfig: {
                
            }
        })
    ]
};

/** @type {import('./packages/types').FigmaExportRC} */
export default {
    commands: [
        ['styles', styleOptions],
        ['components', componentOptions]
    ]
};
