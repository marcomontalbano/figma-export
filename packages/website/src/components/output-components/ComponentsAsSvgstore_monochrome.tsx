import CodeBlock from '@/components/CodeBlock';

const props = {
  title: (
    <>
      Export your icons as <code className="figma-gradient with-opacity-10">Monochrome SVG Symbols</code>
    </>
  ),
  description: (
    <>
      The .svg file contains all components as &lt;symbol&gt; and all <code>fill</code>
      properties are removed from the svg so you can easily customize the icon color from css.
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
              output: './output/svgstore-monochrome',
              svgstoreConfig: {
                cleanSymbols: ['fill']
              }
            })
          ]
        }]
      ]
    }
`
};

const SvgAsSvgstoreMonochromeComponent = () => (
  <CodeBlock {...props}>
    <>
      <svg className="icon"><use href="#[unfilled] icons/figma-export" /></svg>
      <svg className="icon"><use href="#[unfilled] icons/figma-logo" /></svg>
    </>
  </CodeBlock>
);

export default SvgAsSvgstoreMonochromeComponent;
