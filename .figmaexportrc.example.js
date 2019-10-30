module.exports = {

    commands: [
        ['exportComponents', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            output: './output',
            transformers: [
                require('./packages/transform-svg-with-svgo')({
                    plugins: [
                        { removeViewBox: false },
                        { removeDimensions: true }
                    ]
                })
            ],
            outputters: [
                require('./packages/output-components-as-svg')({
                    output: './output'
                }),
                require('./packages/output-components-as-es6')({
                    output: './output'
                })
            ]
        }]
    ],

    configs: [
        ['@figma-export/transform-svg-with-svgo', {
            plugins: [
                { removeViewBox: false },
                { removeDimensions: true }
            ]
        }],
        ['./packages/transform-svg-with-svgo', {
            plugins: [
                { removeViewBox: false },
                { removeDimensions: true }
            ]
        }]
    ]

};
