import GitHubLink from '@/components/GitHubLink';
import OutputComponents from '@/components/output-components';
import OutputStyles from '@/components/output-styles';
import ReadyToStart from '@/components/ReadyToStart';
import Title from '@/components/Title';

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
