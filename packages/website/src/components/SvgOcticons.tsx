// eslint-disable-next-line import/no-unresolved, import/extensions
import * as Octicons from '../../output/es6-dataurl-octicons/icons/octicons-by-github';

// eslint-disable-next-line import/no-unresolved, import/extensions
import { figmaArrow } from '../../output/es6-dataurl/icons';

const SvgOcticons = () => (
  <div className="octicons">
    <div className="figma-screen">
      <img src="/images/figma-octicons.png" alt="" />
    </div>
    <div className="figma-export">
      <div className="figma-gradient text title">
        run<br />
        figma-export<br />
        <img alt="figma arrow" className="figma-arrow" src={figmaArrow} />
      </div>
    </div>
    <div className="icons">
      {
        Object.values(Octicons).reverse().map(
          (octicon, index) => <img key={index} className="icon" alt={`Icon ${index}`} src={octicon} />
        )
      }
    </div>
  </div>
);

export default SvgOcticons;
