import { render, Fragment } from 'preact';

import SvgOcticons from './Hero';
import GitHubLink from './GitHubLink';
import ComponentsAsES6 from './output-components/ComponentsAsES6';
import ComponentsAsSvgstore from './output-components/ComponentsAsSvgstore';

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
    </Fragment>
);

render(<App />, document.getElementById('root'));
