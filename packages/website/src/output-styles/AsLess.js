import { Fragment } from 'preact';
import CodeBlock from '../CodeBlock';

const props = {
    title: (
        <Fragment>
            Export your styles as <code class="figma-gradient with-opacity-10">LESS</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            {/* The .js file contains all components with Base 64 encoding.
            If you want to use it into your images you need to prepend the
            Data URL <code>data:image/svg+xml;base64,</code> */}
        </Fragment>
    ),
    code: `\
module.exports = {
    commands: [
        ['styles', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['figma-styles'],
            outputters: [
                require('@figma-export/output-styles-as-less')({
                    output: './output/less',
                })
            ]
        }]
    ]
}`
};

const AsLess = () => (
    <CodeBlock {...props} />
);

export default AsLess;
