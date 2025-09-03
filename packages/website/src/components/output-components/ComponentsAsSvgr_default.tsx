import CodeBlock from '@/components/CodeBlock';

// biome-ignore lint/suspicious/noTsIgnore: This imported file in auto-generated
// @ts-ignore This imported file in auto-generated
import * as FigmaIcons from '../../../output/svgr/icons';

// biome-ignore lint/suspicious/noTsIgnore: This imported file in auto-generated
// @ts-ignore This imported file in auto-generated
import { Squirrel } from '../../../output/svgr-octicons/icons/octicons-by-github';

const props = {
  title: (
    <>
      Export your icons as{' '}
      <code className="figma-gradient with-opacity-10">React Components</code>
    </>
  ),
  description: (
    <>
      You can easily import the generated <code>.jsx</code> files into your
      project and start using your Figma components as React components.
      <br />
      <code>
        import {'{ Squirrel }'} from
        &apos;./output/icons/octicons-by-github&apos;;
      </code>
    </>
  ),
  code: `
    import asSvgr from '@figma-export/output-components-as-svgr'

    export default {
      commands: [
        ['components', {
          fileId: 'fzYhvQpqwhZDUImRz431Qo',
          onlyFromPages: ['icons/octicons-by-github'],
          outputters: [
            asSvgr({
              output: './output'
            })
          ]
        }]
      ]
    }
`,
};

const ComponentsAsSvgrDefault = () => (
  <CodeBlock {...props}>
    <Squirrel className="icon" />
    <FigmaIcons.FigmaExport className="icon" />
    <FigmaIcons.FigmaLogo className="icon" />
  </CodeBlock>
);

export default ComponentsAsSvgrDefault;
