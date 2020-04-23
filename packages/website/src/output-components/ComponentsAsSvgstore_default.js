/* eslint-disable react/no-danger */
import { Fragment } from 'preact';

import CodeBlock from '../CodeBlock';

const fs = require('fs');

const figmaMonochrome = fs.readFileSync(`${__dirname}/../../output/svgstore/monochrome.svg`, 'utf-8');
const figmaIcons = fs.readFileSync(`${__dirname}/../../output/svgstore/icons.svg`, 'utf-8');

const props = {
    title: (
        <Fragment>
            Export your icons as <code class="figma-gradient with-opacity-10">SVG Symbols</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            The .svg file contains all components as &lt;symbol&gt;
            so you can easly use an icon with
            <code>&lt;svg&gt;&lt;use href="#icon-name" /&gt;&lt;/svg&gt;</code>
        </Fragment>
    ),
    code: `module.exports = {
        commands: [
            ['components', {
                fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
                onlyFromPages: ['icons', 'monochrome'],
                outputters: [
                    require('@figma-export/output-components-as-svgstore')({
                        output: './output/svgstore'
                    })
                ]
            }]
        ]
    }`
};

const SvgAsSvgstoreComponent = () => (
    <CodeBlock {...props}>
        <Fragment>
            <div className="svgstore" dangerouslySetInnerHTML={{ __html: figmaMonochrome }} />
            <div className="svgstore" dangerouslySetInnerHTML={{ __html: figmaIcons }} />
            <svg className="icon"><use href="#icons/figma-export" /></svg>
            <svg className="icon"><use href="#icons/figma-logo" /></svg>
            <svg className="icon"><use href="#monochrome/figma-red" /></svg>
            <svg className="icon"><use href="#monochrome/figma-purple" /></svg>
            <svg className="icon"><use href="#monochrome/figma-blue" /></svg>
            <svg className="icon"><use href="#monochrome/figma-green" /></svg>
        </Fragment>
    </CodeBlock>
);

export default SvgAsSvgstoreComponent;
