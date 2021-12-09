import { Fragment } from 'preact';
import Code from '../components/Code';
import CodeBlock from '../components/CodeBlock';

const props = {
    title: (
        <Fragment>
            Export your styles as <code class="figma-gradient with-opacity-10">LESS</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            <div>
                Once exported, you can import the generated <code>_variables.less</code> and use it.<br />
                It contains <a href="http://lesscss.org/#variables">variables</a> and&nbsp;
                <a href="http://lesscss.org/#maps">maps</a>.
            </div>
            <Code language="less" indent={2} code={`
                    body {
                        color: @color-3;
                        background: @color-linear-gradient;
                        font-family: #regular-text[font-family];
                        font-size: #regular-text[font-size];
                    }
                `}
            />
        </Fragment>
    ),
    code: `
        module.exports = {
            commands: [
                ['styles', {
                    fileId: 'fzYhvQpqwhZDUImRz431Qo',
                    outputters: [
                        // https://www.npmjs.com/package/@figma-export/output-styles-as-less
                        require('@figma-export/output-styles-as-less')({
                            output: './output/less',
                        })
                    ]
                }]
            ]
        }
`
};

const AsLess = () => (
    <CodeBlock {...props} />
);

export default AsLess;
