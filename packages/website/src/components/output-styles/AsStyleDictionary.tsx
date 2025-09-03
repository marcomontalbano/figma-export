import CodeBlock from '@/components/CodeBlock';

const props = {
  title: (
    <>
      Export your styles as{' '}
      <code className="figma-gradient with-opacity-10">Style Dictionary</code>{' '}
      tokens
    </>
  ),
  description: (
    <>
      <div>
        Once exported, you can configure a{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://amzn.github.io/style-dictionary/#/"
        >
          Style Dictionary
        </a>{' '}
        project and use the generated <code>base.json</code>.
      </div>
    </>
  ),
  code: `
    import asStyleDictionary from '@figma-export/output-styles-as-style-dictionary'

    export default {
      commands: [
        ['styles', {
          fileId: 'fzYhvQpqwhZDUImRz431Qo',
          outputters: [
            asStyleDictionary({
              output: './output/style-dictionary',
            })
          ]
        }]
      ]
    }
`,
};

const AsStyleDictionary = () => <CodeBlock {...props} />;

export default AsStyleDictionary;
