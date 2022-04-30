import { useEffect } from 'react';
import Prism from 'prismjs'

import 'prismjs/plugins/autolinker/prism-autolinker'

import 'prismjs/components/prism-less'
import 'prismjs/components/prism-sass'

const Code = ({
    language,
    code,
    className,
    indent = 4
}) => {
    const code_withoutEmptyLine = code.replace(/^\n/g, '')
    const wrongIndentationValue = (code_withoutEmptyLine.match(/^[ ]+/) || [])[0]?.length || 0;

    return (
        <pre className={className}>
            <code className={`language-${language}`}>{
                code_withoutEmptyLine
                    .replace(new RegExp(`^[ ]{${wrongIndentationValue}}`, 'mg'), '')
                    .replace(/[ ]{4}/g, Array(indent).fill(' ').join(''))
            }</code>
        </pre>
    );
}

export default Code;
