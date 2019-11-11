import { h, Fragment } from 'preact';

import * as monochrome from '../svg-es6-base64/monochrome';
import { figmaExport, figmaLogo } from '../svg-es6-base64/icons';

const Icon = ({ svg }) => (
    <img className="icon" src={`data:image/svg+xml;base64,${svg}`} />
);

const Es6Base64 = () => (
    <Fragment>
        <Icon svg={figmaExport} />
        <Icon svg={figmaLogo} />
        <Icon svg={monochrome.figmaBlue} />
        <Icon svg={monochrome.figmaGreen} />
        <Icon svg={monochrome.figmaPurple} />
        <Icon svg={monochrome.figmaRed} />
    </Fragment>
);

export default Es6Base64;
