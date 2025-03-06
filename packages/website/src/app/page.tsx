import GitHubLink from '@/components/GitHubLink'
import ReadyToStart from '@/components/ReadyToStart'
import Title from '@/components/Title'
import OutputComponents from '@/components/output-components'
import OutputStyles from '@/components/output-styles'

export default async function HomePage() {
  return (
    <>
      <Title />
      <GitHubLink />

      <OutputComponents />
      <OutputStyles />

      <ReadyToStart />
    </>
  );
}
