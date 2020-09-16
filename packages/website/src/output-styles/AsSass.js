import { Fragment } from 'preact';
import Code from '../Code';
import CodeBlock from '../CodeBlock';

const props = {
    title: (
        <Fragment>
            Export your styles
            as <code class="figma-gradient with-opacity-10">SASS</code> and <code class="figma-gradient with-opacity-10">SCSS</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            <div>
                Once exported, you can import the generated <code>_variables.scss</code> and use it.<br />
                It contains <a href="https://sass-lang.com/documentation/variables">variables</a> and&nbsp;
                <a href="https://sass-lang.com/documentation/modules/map">maps</a>.
            </div>
            <Code language="sass" indent={2} code={`
                    body {
                        color: $color-3;
                        background: $color-linear-gradient;
                        font-family: map-get($regular-text, "font-family");
                        font-size: map-get($regular-text, "font-size");
                    }
                `}
            />
        </Fragment>
    ),
    code: `
        module.exports = {
            commands: [
                ['styles', {
                    fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
                    outputters: [
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
