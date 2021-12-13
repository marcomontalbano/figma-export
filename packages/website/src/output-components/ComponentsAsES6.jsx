import ComponentsAsES6DataUrl from './ComponentsAsES6_dataUrl';
import ComponentsAsES6Base64 from './ComponentsAsES6_base64';

const ComponentsAsES6 = () => (
    <div className="section-block container text-center">
        <h3 id="svg-into-js"><code className="figma-gradient with-opacity-10">SVG into .js</code></h3>
        <div>
            Exporting SVG into JS is a good solution.
            You will have multiple exported variables that you can easily import in your project.
            Another benefit is being able to use tree shaking
            to load only icons that you really need.
        </div>
        <ComponentsAsES6DataUrl />
        <ComponentsAsES6Base64 />
    </div>
);

export default ComponentsAsES6;
