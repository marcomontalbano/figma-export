module.exports = {

    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            version: 'xxx123456', // marcomontalbano example figma is not on a paid team so has no version history
            outputters: [
                require('@figma-export/output-styles-as-sass')({
                    output: './output'
                })
            ]
        }],

        ['components', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            onlyFromPages: ['icons'],
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
