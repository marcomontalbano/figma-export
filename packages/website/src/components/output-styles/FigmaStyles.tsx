import AsCss from './AsCss';
import AsSass from './AsSass';
import AsLess from './AsLess';
import AsStyleDictionary from './AsStyleDictionary';

const FigmaStyles = () => (
  <div className="section-block container text-center">
    <div>
      You can export Figma Styles to different output.<br />
      <a
        className="full"
        href="https://www.figma.com/file/fzYhvQpqwhZDUImRz431Qo"
        rel="noreferrer noopener"
        target="_blank"
      >https://www.figma.com/file/fzYhvQpqwhZDUImRz431Qo
      </a><br />

      <div className="feature-box">
        <code className="figma-gradient text">Solid Colors</code>
        <div className="figma-box color-1" data-tooltip="color-1" />
        <div className="figma-box color-1-lighter" data-tooltip="color-1-lighter" />
        <div className="figma-box color-2" data-tooltip="color-2" />
        <div className="figma-box color-3" data-tooltip="color-3" />
        <div className="figma-box color-4" data-tooltip="color-4" />
      </div>

      <div className="feature-box">
        <code className="figma-gradient text">Linear Gradients</code>
        <div className="figma-box color-alpha-50" data-tooltip="color-alpha-50" />
        <div className="figma-box color-figma-gradient" data-tooltip="color-figma-gradient" />
        <div className="figma-box color-linear-gradient" data-tooltip="color-linear-gradient" />
        <div className="figma-box color-linear-gradient-alpha" data-tooltip="color-linear-gradient-alpha" />
        <div className="figma-box color-multi-gradient" data-tooltip="color-multi-gradient" />
      </div>

      <div className="feature-box">
        <code className="figma-gradient text">Effects</code>
        <div className="figma-box inner-shadow" data-tooltip="inner-shadow" />
        <div className="figma-box inner-shadow-bottom" data-tooltip="inner-shadow-bottom" />
        <div className="figma-box drop-shadow" data-tooltip="drop-shadow" />
        <div className="figma-box with-content" data-tooltip="layer-blur">
          <div className="figma-box no-margin layer-blur" />
        </div>
        <div className="figma-box multi-shadows" data-tooltip="multi-shadows" />
      </div>

      <div className="feature-box">
        <code className="figma-gradient text">Text</code>
        <div className="figma-box with-content">
          <div className="h1" data-tooltip="h1">Sample text</div>
          <div className="h2" data-tooltip="h2">Sample text</div>
          <div className="regular-text" data-tooltip="regular-text">Sample text</div>
          <div className="deleted-text" data-tooltip="deleted-text">Sample text</div>
        </div>
      </div>
    </div>

    <AsCss />
    <AsStyleDictionary />
    <AsSass />
    <AsLess />
  </div>
);

export default FigmaStyles;
