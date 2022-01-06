import Code from '../components/Code';
import CodeBlock from '../components/CodeBlock';

const props = {
    title: (
        <>
            Export your styles
            as <code className="figma-gradient with-opacity-10">SASS</code> and <code className="figma-gradient with-opacity-10">SCSS</code>
        </>
    ),
    description: (
        <>
            <div>
                Once exported, you can import the generated <code>_variables.scss</code> and use it.<br />
                It contains <a href="https://sass-lang.com/documentation/variables">variables</a> and&nbsp;
                <a href="https://sass-lang.com/documentation/modules/map">maps</a>.
            </div>
            <Code
                language="sass"
                indent={2}
                code={`
                    body {
                        color: $color-3;
                        background: $color-linear-gradient;
                        font-family: map-get($regular-text, "font-family");
                        font-size: map-get($regular-text, "font-size");
                    }
                `}
            />
        </>
    ),
    code: `
        module.exports = {
            commands: [
                ['styles', {
                    fileId: 'fzYhvQpqwhZDUImRz431Qo',
                    outputters: [
                        // https://www.npmjs.com/package/@figma-export/output-styles-as-sass
                        require('@figma-export/output-styles-as-sass')({
                            output: './output/scss',
                        }),
                        require('@figma-export/output-styles-as-sass')({
                            output: './output/sass',
                            getExtension: () => 'SASS',
                        })
                    ]
                }]
            ]
        }
`
};

const AsSass = () => (
    <CodeBlock {...props} />
);

export default AsSass;
