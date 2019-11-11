/* eslint-disable react/no-danger */
import { h, render, Fragment } from 'preact';
import Es6Base64 from './svg-es6-base64';

const App = () => (
    <Fragment>
        <Es6Base64 />
        <svg className="icon" dangerouslySetInnerHTML={{ __html: '<use href="#icons-figma-logo" />' }} />
        <svg className="icon" dangerouslySetInnerHTML={{ __html: '<use href="#icons-figma-export" />' }} />
        <svg className="icon" dangerouslySetInnerHTML={{ __html: '<use href="#monochrome-icons-figma-logo" />' }} />
        <svg className="icon" dangerouslySetInnerHTML={{ __html: '<use href="#monochrome-icons-figma-export" />' }} />
    </Fragment>
);

render(<App />, document.body);
