module.exports = {

    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            // version: 'xxx123456', // optional - file's version history is only supported on paid Figma plans
            // onlyFromPages: ['icons'], // optional - Figma page names (all pages when not specified)
            outputters: [
                require('@figma-export/output-styles-as-sass')({
                    output: './output'
                })
            ]
        }],

        ['components', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            // version: 'xxx123456', // optional - file's version history is only supported on paid Figma plans
            onlyFromPages: ['icons'],
            transformers: [
                require('@figma-export/transform-svg-with-svgo')({
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
