import GitHubLink from './GitHubLink';

const ReadyToStart = () => (
    <div className="container hero figma-gradient with-opacity-05">
        <section>
            <h2 className="figma-gradient text title">ready to start?</h2>
            <img className="shell-image" src="/images/shell.svg" alt="Shell - npm install @figma-export/cli" />
            <GitHubLink />
        </section>
    </div>
);

export default ReadyToStart;
