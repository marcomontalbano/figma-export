module.exports = {

    commands: [
        ['components', {
            fileId: 'FP7lqd1V00LUaT5zvdklkkZr',
            onlyFromPages: ['Octicons'],
            outputters: [
                require('../output-components-as-es6')({
                    output: './output/es6-datauri-octicons',
                    variablePrefix: 'o_',
                    useDataUri: true,
                })
            ]
        }],

        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['icons', 'monochrome'],
            outputters: [
                require('../output-components-as-es6')({
                    output: './output/es6-base64',
                    useBase64: true,
                }),
                require('../output-components-as-es6')({
                    output: './output/es6-datauri',
                    useDataUri: true,
                }),
                // require('../output-components-as-svgstore')({
                //     output: './output/svgstore',
                // }),
                // require('../output-components-as-svgstore')({
                //     output: './output/svgstore-monochrome',
                //     options: {
                //         prefix: 'monochrome-',
                //         cleanSymbols: ['fill']
                //     }
                // }),
            ]
        }]
    ]

};
