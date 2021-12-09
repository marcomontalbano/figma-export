import shellImage from '../images/shell.svg';
import GitHubLink from './GitHubLink';

const ReadyToStart = () => (
    <div class="container hero figma-gradient with-opacity-05">
        <section>
            <h2 class="figma-gradient text title">ready to start?</h2>
            <img className="shell-image" src={shellImage} alt="Shell - npm install figma-export" />
            <GitHubLink />
        </section>
    </div>
);

export default ReadyToStart;
