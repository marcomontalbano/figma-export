// eslint-disable-next-line import/no-unresolved, import/extensions
import * as Octicons from '../output/es6-dataurl-octicons/Octicons';

// eslint-disable-next-line import/no-unresolved, import/extensions
import { figmaArrow } from '../output/es6-dataurl/icons';

import figmaImage from '../images/figma-octicons.png';

const SvgOcticons = () => (
    <div className="octicons">
        <div className="figma-screen">
            <img src={figmaImage} />
        </div>
        <div className="figma-export">
            <div className="figma-gradient text title">
                run<br />
                figma-export<br />
                <img alt="figma arrow" className="figma-arrow" src={figmaArrow} />
            </div>
        </div>
        <div className="icons">
            { Object.values(Octicons).reverse().map(octicon => (<img className="icon" src={octicon} />)) }
        </div>
    </div>
);

export default SvgOcticons;
