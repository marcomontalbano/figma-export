import type React from 'react';
import Code from '@/components/Code';

type Props = {
  title: React.JSX.Element;
  description: React.JSX.Element;
  code: string;
  children?: React.ReactNode;
};

const CodeBlock = ({ title, description, code, children }: Props) => (
  <div className="code-block">
    <div className="code-block--text">
      <h4>{title}</h4>
      <div className="description">{description}</div>
      {children}
    </div>
    <div className="code-block--code">
      <Code
        language="js"
        code={code}
        className="figma-gradient with-opacity-05"
      />
    </div>
  </div>
);

export default CodeBlock;
