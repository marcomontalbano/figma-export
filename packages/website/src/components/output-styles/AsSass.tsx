import Code from '@/components/Code';
import CodeBlock from '@/components/CodeBlock';

const props = {
  title: (
    <>
      Export your styles as{' '}
      <code className="figma-gradient with-opacity-10">SASS</code> and{' '}
      <code className="figma-gradient with-opacity-10">SCSS</code>
    </>
  ),
  description: (
    <>
      <div>
        Once exported, you can import the generated <code>_variables.scss</code>{' '}
        and use it.
        <br />
        It contains{' '}
        <a href="https://sass-lang.com/documentation/variables">variables</a>{' '}
        and&nbsp;
        <a href="https://sass-lang.com/documentation/modules/map">maps</a>.
      </div>
      <Code
        language="sass"
        code={`
          body {
            color: $color-3;
            background: $color-linear-gradient;
            font-family: map-get($regular-text, "font-family");
            font-size: map-get($regular-text, "font-size");
          }
        `}
      />
    </>
  ),
  code: `
    import asSass from '@figma-export/output-styles-as-sass'

    export default {
      commands: [
        ['styles', {
          fileId: 'fzYhvQpqwhZDUImRz431Qo',
          outputters: [
            asSass({
              output: './output/scss',
            }),
            asSass({
              output: './output/sass',
              getExtension: () => 'SASS',
            })
          ]
        }]
      ]
    }
`,
};

const AsSass = () => <CodeBlock {...props} />;

export default AsSass;
