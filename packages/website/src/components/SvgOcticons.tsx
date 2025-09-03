// biome-ignore lint/suspicious/noTsIgnore: This imported file in auto-generated
// @ts-ignore This imported file in auto-generated
import { figmaArrow } from '../../output/es6-dataurl/icons';

// biome-ignore lint/suspicious/noTsIgnore: This imported file in auto-generated
// @ts-ignore This imported file in auto-generated
import * as Octicons from '../../output/es6-dataurl-octicons/icons/octicons-by-github';

const SvgOcticons = () => (
  <div className="octicons">
    <div className="figma-screen">
      <img src="/images/figma-octicons.png" alt="" />
    </div>
    <div className="figma-export">
      <div className="figma-gradient text title">
        run
        <br />
        figma-export
        <br />
        <img alt="figma arrow" className="figma-arrow" src={figmaArrow} />
      </div>
    </div>
    <div className="icons">
      {Object.entries(Octicons)
        .reverse()
        .map(([name, svg]) => (
          <img
            key={name}
            className="icon"
            alt={`Icon ${name}`}
            src={svg as string}
          />
        ))}
    </div>
  </div>
);

export default SvgOcticons;
