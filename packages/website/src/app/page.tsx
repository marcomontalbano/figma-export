import { readFileSync } from 'fs'
import { resolve } from 'path'

import GitHubLink from '@/components/GitHubLink'
import ReadyToStart from '@/components/ReadyToStart'
import Title from '@/components/Title'
import OutputComponents from '@/components/output-components'
import OutputStyles from '@/components/output-styles'

export default async function HomePage() {
  const outputFolder = resolve(process.cwd(), 'output')
  const icons = readFileSync(resolve(outputFolder, 'svgstore', 'icons.svg'), 'utf8')
  const monochromeIcons = readFileSync(resolve(outputFolder, 'svgstore-monochrome', 'icons.svg'), 'utf8')

  return (
    <>
      <div className="svgstore" dangerouslySetInnerHTML={{ __html: icons }} />
      <div className="svgstore" dangerouslySetInnerHTML={{ __html: monochromeIcons }} />

      <Title />
      <GitHubLink />

      <OutputComponents />
      <OutputStyles />

      <ReadyToStart />
    </>
  );
}
