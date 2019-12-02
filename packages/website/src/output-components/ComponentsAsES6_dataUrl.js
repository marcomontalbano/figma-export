import { Fragment } from 'preact';

import CodeBlock from '../CodeBlock';

// eslint-disable-next-line import/no-unresolved
import * as figmaMonochrome from '../../output/es6-dataurl/monochrome';

// eslint-disable-next-line import/no-unresolved
import { figmaExport, figmaLogo } from '../../output/es6-dataurl/icons';

const props = {
    title: (
        <Fragment>
            Export your icons as <code class="figma-gradient with-opacity-10">data:image/svg+xml</code>
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
                        output: './output/es6-dataurl',
                        useDataUrl: true,
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
            <img className="icon" src={figmaMonochrome.figmaRed} />
            <img className="icon" src={figmaMonochrome.figmaPurple} />
            <img className="icon" src={figmaMonochrome.figmaBlue} />
            <img className="icon" src={figmaMonochrome.figmaGreen} />
        </Fragment>
    </CodeBlock>
);

export default SvgAsES6ComponentDataUrl;
