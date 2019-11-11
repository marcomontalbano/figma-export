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
                    output: './svg-es6-base64',
                    useBase64: true,
                }),
                // require('../output-components-as-svgstore')({
                //     output: './svg-svgstore',
                // }),
                // require('../output-components-as-svgstore')({
                //     output: './svg-svgstore-monochrome',
                //     options: {
                //         prefix: 'monochrome-',
                //         cleanSymbols: ['fill']
                //     }
                // }),
            ]
        }]
    ]

};
