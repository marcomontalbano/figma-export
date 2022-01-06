import { useEffect } from 'react';
import Prism from 'prismjs'

import 'prismjs/plugins/autolinker/prism-autolinker'
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'

import 'prismjs/components/prism-less'
import 'prismjs/components/prism-sass'

const Code = ({
    language,
    code,
    className,
    indent = 4
}) => {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <pre className={className}>
            <code className={`language-${language}`}>{code.replace(/[ ]{4}/g, Array(indent).fill(' ').join(''))}</code>
        </pre>
    );
}

export default Code;
