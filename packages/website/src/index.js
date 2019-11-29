import { h, render, Fragment } from 'preact';
import SvgOcticons from './Hero';
import SvgAsES6ComponentDataUrl from './SvgAsES6ComponentDataUrl';
import SvgAsES6ComponentBase64 from './SvgAsES6ComponentBase64';
import GitHubLink from './GitHubLink';

const App = () => (
    <Fragment>
        <div class="container hero figma-gradient with-opacity-05">
            <section>
                <h1 class="figma-gradient text title">@figma-export</h1>
                <p>Export tool for Figma</p>
                <p>
                    You can easily and automatically export your figma components
                    and use them directly into your website
                </p>
            </section>
            <SvgOcticons />
        </div>
        <GitHubLink />
        <SvgAsES6ComponentDataUrl />
        <SvgAsES6ComponentBase64 />
    </Fragment>
);

render(<App />, document.getElementById('root'));
