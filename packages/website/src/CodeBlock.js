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
            <pre className="figma-gradient with-opacity-05"><code className="language-js">{ code }</code></pre>
        </div>
    </div>
);

export default CodeBlock;
