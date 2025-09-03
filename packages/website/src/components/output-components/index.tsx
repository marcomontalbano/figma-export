import ComponentsAsES6 from './ComponentsAsES6';
import ComponentsAsSvgr from './ComponentsAsSvgr';
import ComponentsAsSvgstore from './ComponentsAsSvgstore';

const OutputComponents = () => (
  <div>
    <h2 className="figma-gradient with-opacity-10">Figma Components</h2>
    <ComponentsAsES6 />
    <ComponentsAsSvgstore />
    <ComponentsAsSvgr />
  </div>
);

export default OutputComponents;
