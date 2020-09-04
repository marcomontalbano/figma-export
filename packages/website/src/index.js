import { render, Fragment, hydrate } from 'preact';

import SvgOcticons from './SvgOcticons';
import GitHubLink from './GitHubLink';

import OutputComponents from './output-components';
import OutputStyles from './output-styles';

const App = () => (
    <Fragment>
        <div class="container hero figma-gradient with-opacity-05">
            <section>
                <h1 class="figma-gradient text title">@figma-export</h1>
                <p>Export tool for Figma</p>
                <p>
                    You can easily and automatically export your
                    figma <code class="figma-gradient with-opacity-10">components</code> and <code class="figma-gradient with-opacity-10">styles</code> and
                    use them directly into your website
                </p>
            </section>
            <SvgOcticons />
        </div>

        <GitHubLink />

        <OutputComponents />
        <OutputStyles />
    </Fragment>
);

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);
}
else {
    render(<App />, rootElement);
}
