import GitHubLink from '../src/GitHubLink'

export default function HomePage() {
    return (
        <>
            <div className="container hero figma-gradient with-opacity-05">
                <section>
                    <h1 className="figma-gradient text title">@figma-export</h1>
                    <p>you are authorized</p>
                </section>
            </div>
            <GitHubLink />
        </>
    );
}
