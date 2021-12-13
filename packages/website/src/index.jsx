import { render, Fragment, hydrate } from 'preact';

import GitHubLink from './GitHubLink';
import Title from './Title';
import ReadyToStart from './ReadyToStart';

import OutputComponents from './output-components';
import OutputStyles from './output-styles';

const App = () => (
    <Fragment>
        <Title />
        <GitHubLink />

        <OutputComponents />
        <OutputStyles />

        <ReadyToStart />
    </Fragment>
);

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);
} else {
    render(<App />, rootElement);
}
