// biome-ignore lint/suspicious/noTsIgnore: This imported file in auto-generated
// @ts-ignore This imported file in auto-generated
import { iconMarkGithub } from '../../output/es6-dataurl-octicons/icons/octicons-by-github';

const GitHubLink = ({ children }: { children?: React.ReactNode }) => (
  <div className="github-link">
    <a href="https://github.com/marcomontalbano/figma-export">
      @figma-export
      <img src={iconMarkGithub} alt="GitHub logo" />
    </a>
    {children}
  </div>
);

export default GitHubLink;
