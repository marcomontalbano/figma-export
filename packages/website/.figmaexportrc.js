module.exports = {

    commands: [
        ['components', {
            fileId: 'FP7lqd1V00LUaT5zvdklkkZr',
            onlyFromPages: ['Octicons'],
            outputters: [
                require('../output-components-as-es6')({
                    output: './output/es6-dataurl-octicons',
                    variablePrefix: 'icon',
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
                    iconPrefix: 'unfilled-',
                    options: {
                        cleanSymbols: ['fill']
                    }
                }),
            ]
        }]
    ]

};
