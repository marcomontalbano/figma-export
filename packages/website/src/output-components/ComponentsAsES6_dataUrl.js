import { Fragment } from 'preact';

import CodeBlock from '../components/CodeBlock';

// eslint-disable-next-line import/no-unresolved, import/extensions
import { figmaExport, figmaLogo } from '../../output/es6-dataurl/icons';

const props = {
    title: (
        <Fragment>
            Export your icons as <code class="figma-gradient with-opacity-10">data:image/svg+xml</code>
        </Fragment>
    ),
    description: (
        <Fragment>
            The .js file contains all components as Data URL so you can easly put this value into
            the src of your images. <a target="_blank" rel="noopener noreferrer" href="https://css-tricks.com/probably-dont-base64-svg/">
                This is the best way</a> to load an svg as image.
        </Fragment>
    ),
    code: `
        module.exports = {
            commands: [
                ['components', {
                    fileId: 'fzYhvQpqwhZDUImRz431Qo',
                    onlyFromPages: ['icons'],
                    outputters: [
                        require('@figma-export/output-components-as-es6')({
                            output: './output/es6-dataurl',
                            useDataUrl: true,
                        })
                    ]
                }]
            ]
        }
`
};

const SvgAsES6ComponentDataUrl = () => (
    <CodeBlock {...props}>
        <Fragment>
            <img className="icon" src={figmaExport} />
            <img className="icon" src={figmaLogo} />
        </Fragment>
    </CodeBlock>
);

export default SvgAsES6ComponentDataUrl;
