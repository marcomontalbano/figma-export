const { camelCase } = require('@figma-export/output-components-utils');

module.exports = {

    commands: [
        ['components', {
            fileId: 'e7Jl5rSEwq7ekSyFJFxA2D',
            onlyFromPages: ['Octicons'],
            outputters: [
                require('../output-components-as-es6/dist')({
                    output: './output/es6-dataurl-octicons',
                    getVariableName: (options) => camelCase(`icon ${options.componentName}`),
                    useDataUrl: true,
                })
            ]
        }],

        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['icons', 'monochrome', 'unit-test'],
            outputters: [
                require('../output-components-as-svg')({
                    output: './output/svg',
                }),

                require('../output-components-as-es6/dist')({
                    output: './output/es6-base64',
                    useBase64: true,
                }),
                require('../output-components-as-es6/dist')({
                    output: './output/es6-dataurl',
                    useDataUrl: true,
                }),

                require('../output-components-as-svgstore')({
                    output: './output/svgstore',
                }),

                require('../output-components-as-svgstore')({
                    output: './output/svgstore-monochrome',
                    getIconId: (options) => `[unfilled] ${options.pageName}/${options.componentName}`,
                    options: {
                        cleanSymbols: ['fill']
                    }
                }),
            ]
        }]
    ]

};
