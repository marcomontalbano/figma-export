import CodeBlock from '../components/CodeBlock';

const props = {
    title: (
        <>
            Export your icons as <code className="figma-gradient with-opacity-10">SVG Symbols</code>
        </>
    ),
    description: (
        <>
            The .svg file contains all components as &lt;symbol&gt;
            so you can easly use an icon with
            <code>&lt;svg&gt;&lt;use href=&quot;#icon-name&quot; /&gt;&lt;/svg&gt;</code>
        </>
    ),
    code: `
        module.exports = {
            commands: [
                ['components', {
                    fileId: 'fzYhvQpqwhZDUImRz431Qo',
                    onlyFromPages: ['icons'],
                    outputters: [
                        // https://www.npmjs.com/package/@figma-export/output-components-as-svgstore
                        require('@figma-export/output-components-as-svgstore')({
                            output: './output/svgstore'
                        })
                    ]
                }]
            ]
        }
`
};

const SvgAsSvgstoreComponent = () => (
    <CodeBlock {...props}>
        <>
            <svg className="icon"><use href="#icons/figma-export" /></svg>
            <svg className="icon"><use href="#icons/figma-logo" /></svg>
        </>
    </CodeBlock>
);

export default SvgAsSvgstoreComponent;
