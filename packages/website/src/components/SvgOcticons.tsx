import * as Octicons
  // @ts-ignore This imported file in auto-generated
  from '../../output/es6-dataurl-octicons/icons/octicons-by-github';

import { figmaArrow }
  // @ts-ignore This imported file in auto-generated
  from '../../output/es6-dataurl/icons';

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
          (octicon, index) => <img key={index} className="icon" alt={`Icon ${index}`} src={octicon as string} />
        )
      }
    </div>
  </div>
);

export default SvgOcticons;
