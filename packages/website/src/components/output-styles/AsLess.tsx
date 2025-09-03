import Code from '@/components/Code';
import CodeBlock from '@/components/CodeBlock';

const props = {
  title: (
    <>
      Export your styles as{' '}
      <code className="figma-gradient with-opacity-10">LESS</code>
    </>
  ),
  description: (
    <>
      <div>
        Once exported, you can import the generated <code>_variables.less</code>{' '}
        and use it.
        <br />
        It contains <a href="http://lesscss.org/#variables">variables</a>{' '}
        and&nbsp;
        <a href="http://lesscss.org/#maps">maps</a>.
      </div>
      <Code
        language="less"
        code={`
          body {
            color: @color-3;
            background: @color-linear-gradient;
            font-family: #regular-text[font-family];
            font-size: #regular-text[font-size];
          }
        `}
      />
    </>
  ),
  code: `
    import asLess from '@figma-export/output-styles-as-less'

    export default {
      commands: [
        ['styles', {
          fileId: 'fzYhvQpqwhZDUImRz431Qo',
          outputters: [
            asLess({
              output: './output/less',
            })
          ]
        }]
      ]
    }
`,
};

const AsLess = () => <CodeBlock {...props} />;

export default AsLess;
