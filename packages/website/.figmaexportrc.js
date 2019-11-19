module.exports = {

    commands: [
        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['icons', 'monochrome'],
            transformers: [
                require('../transform-svg-with-svgo')({
                    plugins: [
                        { removeViewBox: false },
                        { removeDimensions: true }
                    ]
                })
            ],
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
