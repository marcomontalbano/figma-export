module.exports = {

    commands: [
        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['icons', 'monochrome'],
            transformers: [
                require('@figma-export/transform-svg-with-svgo')({
                    plugins: [
                        { removeViewBox: false },
                        { removeDimensions: true }
                    ]
                })
            ],
            outputters: [
                require('@figma-export/output-components-as-svg')({
                    output: './output'
                }),
                require('@figma-export/output-components-as-es6')({
                    output: './output'
                })
            ]
        }]
    ]

};
