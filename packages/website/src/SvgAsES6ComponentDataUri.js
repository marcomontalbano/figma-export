import { h, Fragment } from 'preact';

import * as figmaMonochrome from '../output/es6-datauri/monochrome';
import { figmaExport, figmaLogo } from '../output/es6-datauri/icons';

const SvgAsES6ComponentDataUri = () => (
    <Fragment>
        <img className="icon" src={figmaExport} />
        <img className="icon" src={figmaLogo} />
        <img className="icon" src={figmaMonochrome.figmaBlue} />
        <img className="icon" src={figmaMonochrome.figmaGreen} />
        <img className="icon" src={figmaMonochrome.figmaPurple} />
        <img className="icon" src={figmaMonochrome.figmaRed} />
    </Fragment>
);

export default SvgAsES6ComponentDataUri;
