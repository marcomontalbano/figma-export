import GitHubLink from './GitHubLink';

const ReadyToStart = () => (
  <div className="container hero figma-gradient with-opacity-05">
    <section>
      <h2 className="figma-gradient text title">ready to start?</h2>
      <img
        className="shell-image"
        src="/images/shell.png"
        alt="Shell - npm install @figma-export/cli"
      />
      <GitHubLink>
        <div>
          This site is powered by{' '}
          <a href="https://www.netlify.com" target="_blank" rel="noopener">
            Netlify
          </a>
        </div>
      </GitHubLink>
    </section>
  </div>
);

export default ReadyToStart;
