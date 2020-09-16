import { Fragment } from 'preact';
import Code from '../Code';
import CodeBlock from '../CodeBlock';

const props = {
    title: (
        <Fragment>
            Export your styles as <code class="figma-gradient with-opacity-10">CSS Variables</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            <div>Once exported, you can easly use them directly into your <code>css</code> file.</div>
            <Code language="css" indent={2} code={`
                    body {
                        color: var(--color-3);
                        background: var(--color-linear-gradient);
                        font-family: var(--regular-test-font-family);
                        font-size: var(--regular-test-font-size);
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
                        require('@figma-export/output-styles-as-css')({
                            output: './output/css',
                        })
                    ]
                }]
            ]
        }
    `
};

const AsCss = () => (
    <CodeBlock {...props} />
);

export default AsCss;
