import CodeBlock from '../components/CodeBlock';

// eslint-disable-next-line import/no-unresolved, import/extensions
import * as FigmaIcons from '../../output/svgr/icons';

// eslint-disable-next-line import/no-unresolved, import/extensions
import { Squirrel } from '../../output/svgr-octicons/icons/octicons-by-github';

const props = {
    title: (
        <>
            Export your icons as <code className="figma-gradient with-opacity-10">React Components</code>
        </>
    ),
    description: (
        <>
            You can easily import the generated <code>.jsx</code> files into your project and
            start using your Figma components as React components.<br />
            <code>import {'{ Squirrel }'} from &apos;./output/icons/octicons-by-github&apos;;</code>
        </>
    ),
    code: `
        module.exports = {
            commands: [
                ['components', {
                    fileId: 'fzYhvQpqwhZDUImRz431Qo',
                    onlyFromPages: ['icons/octicons-by-github'],
                    outputters: [
                        // https://www.npmjs.com/package/@figma-export/output-components-as-svgr
                        require('@figma-export/output-components-as-svgr')({
                            output: './output'
                        })
                    ]
                }]
            ]
        }
`
};

const ComponentsAsSvgrDefault = () => (
    <CodeBlock {...props}>
        <>
            <Squirrel className="icon" />
            <FigmaIcons.FigmaExport className="icon" />
            <FigmaIcons.FigmaLogo className="icon" />
        </>
    </CodeBlock>
);

export default ComponentsAsSvgrDefault;
