const { camelCase } = require('@figma-export/utils');

module.exports = {

    commands: [
        ['styles', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            outputters: [
                require('../output-styles-as-sass')({
                    output: './output/figma-styles'
                }),
            ]
        }],

        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['octicons-by-github'],
            outputters: [
                require('../output-components-as-es6')({
                    output: './output/es6-dataurl-octicons',
                    getVariableName: (options) => camelCase(`icon ${options.componentName}`),
                    useDataUrl: true,
                }),

                require('../output-components-as-svgr')({
                    output: './output/svgr-octicons',
                    getSvgrConfig: () => ({
                        template: ({ template }, opts, { componentName, props, jsx, exports }) => template.ast`
                            const ${componentName} = (${props}) => (${jsx});
                            ${exports}
                        `
                    })
                }),
            ]
        }],

        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['icons', 'monochrome', 'unit-test'],
            transformers: [
                require('../transform-svg-with-svgo')({
                    plugins: [
                        { removeViewBox: false },
                        { removeDimensions: true },
                    ]
                })
            ],
            outputters: [
                require('../output-components-as-svg')({
                    output: './output/svg',
                }),

                require('../output-components-as-svgr')({
                    output: './output/svgr',
                    getSvgrConfig: () => ({
                        template: ({ template }, opts, { componentName, props, jsx, exports }) => template.ast`
                            const ${componentName} = (${props}) => (${jsx});
                            ${exports}
                        `
                    })
                }),

                require('../output-components-as-es6')({
                    output: './output/es6-base64',
                    useBase64: true,
                }),
                require('../output-components-as-es6')({
                    output: './output/es6-dataurl',
                    useDataUrl: true,
                }),

                require('../output-components-as-svgstore')({
                    output: './output/svgstore',
                }),

                require('../output-components-as-svgstore')({
                    output: './output/svgstore-monochrome',
                    getIconId: (options) => `[unfilled] ${options.pageName}/${options.componentName}`,
                    svgstoreConfig: {
                        cleanSymbols: ['fill']
                    }
                }),
            ]
        }]
    ]

};
