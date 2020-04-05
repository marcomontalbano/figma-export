/* eslint-disable react/no-danger */
import { Fragment } from 'preact';

import CodeBlock from '../CodeBlock';

const fs = require('fs');

const figmaIcons = fs.readFileSync(`${__dirname}/../../output/svgstore-monochrome/icons.svg`, 'utf-8');

const props = {
    title: (
        <Fragment>
            Export your icons as <code class="figma-gradient with-opacity-10">Monochrome SVG Symbols</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            The .svg file contains all components as &lt;symbol&gt; and all <code>fill</code>
            properties are removed from the svg so you can easily customize the icon color from css.
        </Fragment>
    ),
    code: `module.exports = {
        commands: [
            ['components', {
                fileId: 'FP7lqd1V00LUaT5zvdklkkZr',
                onlyFromPages: ['Octicons'],
                outputters: [
                    require('@figma-export/output-components-as-svgstore')({
                        output: './output/svgstore-monochrome',
                        svgstoreConfig: {
                            cleanSymbols: ['fill']
                        }
                    })
                ]
            }]
        ]
    }`
};

const SvgAsSvgstoreMonochromeComponent = () => (
    <CodeBlock {...props}>
        <Fragment>
            <div className="svgstore" dangerouslySetInnerHTML={{ __html: figmaIcons }} />
            <svg className="icon"><use href="#[unfilled] icons/figma-export" /></svg>
            <svg className="icon"><use href="#[unfilled] icons/figma-logo" /></svg>
        </Fragment>
    </CodeBlock>
);

export default SvgAsSvgstoreMonochromeComponent;
