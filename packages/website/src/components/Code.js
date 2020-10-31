const Code = ({
    language,
    code,
    className,
    indent = 4
}) => (
    <pre className={className}>
        <code className={`language-${language}`}>{code.replace(/[ ]{4}/g, Array(indent).fill(' ').join(''))}</code>
    </pre>
);

export default Code;
