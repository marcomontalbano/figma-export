
// eslint-disable-next-line import/no-unresolved
import { iconMarkGithub } from '../output/es6-dataurl-octicons/Octicons';

const GitHubLink = () => (
    <div className="github-link">
        <a href="https://github.com/marcomontalbano/figma-export">
            @figma-export
            <img src={iconMarkGithub} alt="GitHub logo" />
        </a>
    </div>
);

export default GitHubLink;
