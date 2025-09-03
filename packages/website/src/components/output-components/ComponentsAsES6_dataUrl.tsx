import Image from 'next/image';
import CodeBlock from '@/components/CodeBlock';
// biome-ignore lint/suspicious/noTsIgnore: This imported file in auto-generated
// @ts-ignore This imported file in auto-generated
import { figmaExport, figmaLogo } from '../../../output/es6-dataurl/icons';

const props = {
  title: (
    <>
      Export your icons as{' '}
      <code className="figma-gradient with-opacity-10">data:image/svg+xml</code>
    </>
  ),
  description: (
    <>
      The .js file contains all components as Data URL so you can easly put this
      value into the src of your images.{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://css-tricks.com/probably-dont-base64-svg/"
      >
        This is the best way
      </a>{' '}
      to load an svg as image.
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
            asES6({
              output: './output/es6-dataurl',
              useDataUrl: true,
            })
          ]
        }]
      ]
    }
`,
};

const SvgAsES6ComponentDataUrl = () => (
  <CodeBlock {...props}>
    <Image
      width={35}
      height={35}
      className="icon"
      alt="Figma Export icon"
      src={figmaExport}
    />
    <Image
      width={35}
      height={35}
      className="icon"
      alt="Figma Export logo"
      src={figmaLogo}
    />
  </CodeBlock>
);

export default SvgAsES6ComponentDataUrl;
