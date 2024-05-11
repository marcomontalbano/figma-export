import Prism from 'prismjs'

import 'prismjs/plugins/autolinker/prism-autolinker'

import 'prismjs/components/prism-less'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-bash'

type Props = {
  language: 'js' | 'css' | 'less' | 'sass' | 'bash'
  code: string
  className?: string
}

const Code = ({
  language,
  code,
  className
}: Props) => {
  const code_withoutEmptyLine = code.replace(/^\n/g, '')
  const wrongIndentationValue = (code_withoutEmptyLine.match(/^[ ]+/) || [])[0]?.length || 0;

  const html = Prism.highlight(
    code_withoutEmptyLine
      .replace(new RegExp(`^[ ]{${wrongIndentationValue}}`, 'mg'), ''),
    Prism.languages[language],
    language
  )

  return (
    <pre
      className={`language-${language} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default Code;
