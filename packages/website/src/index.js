import { render, Fragment, hydrate } from 'preact';

import SvgOcticons from './SvgOcticons';
import GitHubLink from './GitHubLink';
import ComponentsAsES6 from './output-components/ComponentsAsES6';
import ComponentsAsSvgstore from './output-components/ComponentsAsSvgstore';
import ComponentsAsSvgr from './output-components/ComponentsAsSvgr';

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
        <ComponentsAsES6 />
        <ComponentsAsSvgstore />
        <ComponentsAsSvgr />
    </Fragment>
);

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);
}
else {
    render(<App />, rootElement);
}
