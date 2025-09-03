import CodeBlock from '@/components/CodeBlock';

const props = {
  title: (
    <>
      Export your icons as{' '}
      <code className="figma-gradient with-opacity-10">SVG Symbols</code>
    </>
  ),
  description: (
    <>
      The .svg file contains all components as &lt;symbol&gt; so you can easly
      use an icon with
      <code>
        &lt;svg&gt;&lt;use href=&quot;/icons.svg#icon-name&quot;
        /&gt;&lt;/svg&gt;
      </code>
    </>
  ),
  code: `
    import asSvgstore from '@figma-export/output-components-as-svgstore'

    export default {
      commands: [
        ['components', {
          fileId: 'fzYhvQpqwhZDUImRz431Qo',
          onlyFromPages: ['icons'],
          outputters: [
            asSvgstore({
              output: './output/svgstore'
            })
          ]
        }]
      ]
    }
`,
};

const SvgAsSvgstoreComponent = () => (
  <CodeBlock {...props}>
    <svg className="icon">
      <title>Figma Export</title>
      <use href="/output/svgstore/icons.svg#icons/figma-export" />
    </svg>
    <svg className="icon">
      <title>Figma Logo</title>
      <use href="/output/svgstore/icons.svg#icons/figma-logo" />
    </svg>
  </CodeBlock>
);

export default SvgAsSvgstoreComponent;
