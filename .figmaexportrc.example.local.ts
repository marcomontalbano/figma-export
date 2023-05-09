/**
 * If you want to try this configuration you can just run:
 *   $ yarn
 *   $ ./node_modules/.bin/ts-node ./packages/cli/bin/run use-config ./.figmaexportrc.example.local.ts
 */

import path from 'path'

import { FigmaExportRC, StylesCommandOptions, ComponentsCommandOptions } from './packages/types';

import outputStylesAsCss from './packages/output-styles-as-css';
import outputStylesAsLess from './packages/output-styles-as-less';
import outputStylesAsSass from './packages/output-styles-as-sass';
import transformSvgWithSvgo from './packages/transform-svg-with-svgo';
import outputComponentsAsEs6 from './packages/output-components-as-es6';
import outputComponentsAsSvg from './packages/output-components-as-svg';
import outputComponentsAsSvgr from './packages/output-components-as-svgr';
import outputComponentsAsSvgstore from './packages/output-components-as-svgstore';

const styleOptions: StylesCommandOptions = {
    fileId: 'fzYhvQpqwhZDUImRz431Qo',
    // onlyFromPages: ['icons'], // optional - Figma page names (all pages when not specified)
    outputters: [
        outputStylesAsCss({
            output: './output/styles/css'
        }),
        outputStylesAsLess({
            output: './output/styles/less'
        }),
        outputStylesAsSass({
            output: './output/styles/sass'
        })
    ]
};

const componentOptions: ComponentsCommandOptions = {
    fileId: 'fzYhvQpqwhZDUImRz431Qo',
    onlyFromPages: ['icons', 'unit-test', 'octicons-by-github'],
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
                    name: 'removeDimensions',
                    active: true
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

(module.exports as FigmaExportRC) = {
    commands: [
        ['styles', styleOptions],
        ['components', componentOptions]
    ]
};
