/* eslint-disable import/no-unresolved */
import { h, Fragment } from 'preact';

import * as figmaMonochrome from '../output/es6-base64/monochrome';
import { figmaExport, figmaLogo } from '../output/es6-base64/icons';

const Icon = ({ svg }) => (
    <img className="icon" src={`data:image/svg+xml;base64,${svg}`} />
);

const SvgAsES6ComponentBase64 = () => (
    <Fragment>
        <Icon svg={figmaExport} />
        <Icon svg={figmaLogo} />
        <Icon svg={figmaMonochrome.figmaBlue} />
        <Icon svg={figmaMonochrome.figmaGreen} />
        <Icon svg={figmaMonochrome.figmaPurple} />
        <Icon svg={figmaMonochrome.figmaRed} />
    </Fragment>
);

export default SvgAsES6ComponentBase64;
