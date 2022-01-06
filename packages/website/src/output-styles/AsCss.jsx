import Code from '../components/Code';
import CodeBlock from '../components/CodeBlock';

const props = {
    title: (
        <>
            Export your styles as <code className="figma-gradient with-opacity-10">CSS Variables</code>
        </>
    ),
    description: (
        <>
            <div>Once exported, you can easly use them directly into your <code>css</code> file.</div>
            <Code
                language="css"
                indent={2}
                code={`
                    body {
                        color: var(--color-3);
                        background: var(--color-linear-gradient);
                        font-family: var(--regular-text-font-family);
                        font-size: var(--regular-text-font-size);
                    }
                `}
            />
        </>
    ),
    code: `
        module.exports = {
            commands: [
                ['styles', {
                    fileId: 'fzYhvQpqwhZDUImRz431Qo',
                    outputters: [
                        // https://www.npmjs.com/package/@figma-export/output-styles-as-css
                        require('@figma-export/output-styles-as-css')({
                            output: './output/css',
                        })
                    ]
                }]
            ]
        }
    `
};

const AsCss = () => (
    <CodeBlock {...props} />
);

export default AsCss;
