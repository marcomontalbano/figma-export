/* eslint-disable react/no-danger */
import { h } from 'preact';

import { o_markGithub } from '../output/es6-datauri-octicons/Octicons';

const GitHubLink = () => (
    <div className="github-link">
        <a href="https://github.com/marcomontalbano/figma-export">
            @figma-export
            <img src={o_markGithub} alt="GitHub logo" />
        </a>
    </div>
);

export default GitHubLink;
