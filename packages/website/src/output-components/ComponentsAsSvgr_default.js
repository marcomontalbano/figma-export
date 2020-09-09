/* eslint-disable react/no-danger */
import { Fragment } from 'preact';

import CodeBlock from '../CodeBlock';

// eslint-disable-next-line import/no-unresolved, import/extensions
import * as FigmaMonochrome from '../../output/svgr/monochrome';

// eslint-disable-next-line import/no-unresolved, import/extensions
import * as FigmaIcons from '../../output/svgr/icons';

// eslint-disable-next-line import/no-unresolved, import/extensions
import { Squirrel } from '../../output/svgr-octicons/octicons-by-github';

const props = {
    title: (
        <Fragment>
            Export your icons as <code class="figma-gradient with-opacity-10">React Components</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            You can easily import the generated <code>.jsx</code> files into your project and
            start using your Figma components as React components.<br />
            <code>import {`{ Squirrel }`} from './output/octicons-by-github';</code>
        </Fragment>
    ),
    code: `\
module.exports = {
    commands: [
        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['octicons-by-github'],
            outputters: [
                require('@figma-export/output-components-as-svgr')({
                    output: './output'
                })
            ]
        }]
    ]
}`
};

const ComponentsAsSvgrDefault = () => (
    <CodeBlock {...props}>
        <Fragment>
            <Squirrel className="icon" />
            <FigmaIcons.FigmaExport className="icon" />
            <FigmaIcons.FigmaLogo className="icon" />
            <FigmaMonochrome.FigmaRed className="icon" />
            <FigmaMonochrome.FigmaPurple className="icon" />
            <FigmaMonochrome.FigmaBlue className="icon" />
            <FigmaMonochrome.FigmaGreen className="icon" />
        </Fragment>
    </CodeBlock>
);

export default ComponentsAsSvgrDefault;
