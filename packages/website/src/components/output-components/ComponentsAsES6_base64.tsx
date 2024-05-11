import CodeBlock from '@/components/CodeBlock';

// eslint-disable-next-line import/no-unresolved, import/extensions
import { figmaExport, figmaLogo } from '../../../output/es6-base64/icons';

const props = {
  title: (
    <>
      Export your icons as <code className="figma-gradient with-opacity-10">Base 64</code>
    </>
  ),
  description: (
    <>
      The .js file contains all components with Base 64 encoding.
      If you want to use it into your images you need to prepend the
      Data URL <code>data:image/svg+xml;base64,</code>
    </>
  ),
  code: `
    import asES6 from '@figma-export/output-components-as-es6'

    export default {
      commands: [
        ['components', {
          fileId: 'fzYhvQpqwhZDUImRz431Qo',
          onlyFromPages: ['icons'],
          outputters: [
            // https://www.npmjs.com/package/@figma-export/output-components-as-es6
            asES6({
              output: './output/es6-base64',
              useBase64: true,
            })
          ]
        }]
      ]
    }
`
};

const Icon = ({ svg }: { svg: string }) => (
  <img className="icon" alt="svg icon" src={`data:image/svg+xml;base64,${svg}`} />
);

const SvgAsES6ComponentBase64 = () => (
  <CodeBlock {...props}>
    <>
      <Icon svg={figmaExport} />
      <Icon svg={figmaLogo} />
    </>
  </CodeBlock>
);

export default SvgAsES6ComponentBase64;
