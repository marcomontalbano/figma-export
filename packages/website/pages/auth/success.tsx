import Link from 'next/link'
import GitHubLink from '../../src/GitHubLink'

export default function HomePage() {
    return (
        <>
            <div className="container hero figma-gradient with-opacity-05">
                <section>
                    <h1 className="title">
                        <Link href="/"><a className="figma-gradient text">
                            @figma-export
                        </a></Link>
                    </h1>
                    <p>
                        <code className="figma-gradient with-opacity-10">authentication complete</code>
                    </p>
                    <p>You may now close this window</p>
                </section>
            </div>
            <GitHubLink />
        </>
    );
}
