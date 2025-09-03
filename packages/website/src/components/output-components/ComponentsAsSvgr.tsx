import ComponentsAsSvgrDefault from './ComponentsAsSvgr_default';

const ComponentsAsSvgr = () => (
  <div className="section-block container text-center">
    <h3>
      <code className="figma-gradient with-opacity-10">
        SVG into (p)React Component
      </code>
    </h3>
    <div>
      If you work on a React/Preact project, probably you need to export your
      Figma components into (p)React components.
    </div>
    <ComponentsAsSvgrDefault />
  </div>
);

export default ComponentsAsSvgr;
