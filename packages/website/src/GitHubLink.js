/* eslint-disable react/no-danger */
import { h } from 'preact';

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
