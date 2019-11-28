/* eslint-disable import/no-unresolved */
import { h, Fragment } from 'preact';

import CodeBlock from './CodeBlock';
import * as figmaMonochrome from '../output/es6-datauri/monochrome';
import { figmaExport, figmaLogo } from '../output/es6-datauri/icons';

const props = {
    title: (
        <Fragment>
            Export to <code class="figma-gradient with-opacity-10">.js</code> as <code class="figma-gradient with-opacity-10">data:image/svg+xml</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            The .js file contains all components as Data URL so you can easly put this value into the src of your images. <a target="_blank" rel="noopener noreferrer" href="https://css-tricks.com/probably-dont-base64-svg/">This is the best way</a> to load an svg as image.
        </Fragment>
    ),
    code: `module.exports = {
        commands: [
            ['components', {
                fileId: 'FP7lqd1V00LUaT5zvdklkkZr',
                onlyFromPages: ['Octicons'],
                outputters: [
                    require('@figma-export/output-components-as-es6')({
                        output: './output/es6-datauri',
                        useDataUri: true,
                    })
                ]
            }]
        ]
    }`
};

const SvgAsES6ComponentDataUrl = () => (
    <CodeBlock {...props}>
        <Fragment>
            <img className="icon" src={figmaExport} />
            <img className="icon" src={figmaLogo} />
            <img className="icon" src={figmaMonochrome.figmaBlue} />
            <img className="icon" src={figmaMonochrome.figmaGreen} />
            <img className="icon" src={figmaMonochrome.figmaPurple} />
            <img className="icon" src={figmaMonochrome.figmaRed} />
        </Fragment>
    </CodeBlock>
);

export default SvgAsES6ComponentDataUrl;
