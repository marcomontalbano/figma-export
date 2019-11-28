/* eslint-disable import/no-unresolved */
import { h, Fragment } from 'preact';

import CodeBlock from './CodeBlock';
import * as figmaMonochrome from '../output/es6-base64/monochrome';
import { figmaExport, figmaLogo } from '../output/es6-base64/icons';

const props = {
    title: (
        <Fragment>
            Export to <code class="figma-gradient with-opacity-10">.js</code> as <code class="figma-gradient with-opacity-10">Base 64</code>
        </Fragment>
    ),
    description: 'The .js file contains all components with Base 64 encoding. If you want to use it into your images you need to prepend the Data URL "data:image/svg+xml;base64,"',
    code: `module.exports = {
        commands: [
            ['components', {
                fileId: 'FP7lqd1V00LUaT5zvdklkkZr',
                onlyFromPages: ['Octicons'],
                outputters: [
                    require('@figma-export/output-components-as-es6')({
                        output: './output/es6-base64',
                        useBase64: true,
                    })
                ]
            }]
        ]
    }`
};

const Icon = ({ svg }) => (
    <img className="icon" src={`data:image/svg+xml;base64,${svg}`} />
);

const SvgAsES6ComponentBase64 = () => (
    <CodeBlock {...props}>
        <Fragment>
            <Icon svg={figmaExport} />
            <Icon svg={figmaLogo} />
            <Icon svg={figmaMonochrome.figmaBlue} />
            <Icon svg={figmaMonochrome.figmaGreen} />
            <Icon svg={figmaMonochrome.figmaPurple} />
            <Icon svg={figmaMonochrome.figmaRed} />
        </Fragment>
    </CodeBlock>
);

export default SvgAsES6ComponentBase64;
