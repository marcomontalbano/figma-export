/* eslint-disable react/no-danger */
import { h, render, Fragment } from 'preact';
import SvgAsES6ComponentBase64 from './SvgAsES6ComponentBase64';
import SvgAsES6ComponentDataUri from './SvgAsES6ComponentDataUri';

const App = () => (
    <Fragment>
        <div>
            <SvgAsES6ComponentBase64 />
        </div>
        <div>
            <SvgAsES6ComponentDataUri />
        </div>
    </Fragment>
);

render(<App />, document.body);
