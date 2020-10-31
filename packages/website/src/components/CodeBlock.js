import Code from './Code';

const CodeBlock = ({
    title,
    description,
    code,
    children
}) => (
    <div className="code-block">
        <div class="code-block--text">
            <h4>{title}</h4>
            <p>{description}</p>
            {children}
        </div>
        <div class="code-block--code">
            <Code language="js" code={code} className="figma-gradient with-opacity-05" />
        </div>
    </div>
);

export default CodeBlock;
