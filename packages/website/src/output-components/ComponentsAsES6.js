import ComponentsAsES6DataUrl from './ComponentsAsES6_dataUrl';
import ComponentsAsES6Base64 from './ComponentsAsES6_base64';

const ComponentsAsES6 = () => (
    <div class="section-block container text-center">
        <h2><code class="figma-gradient with-opacity-10">SVG into .js</code></h2>
        <p>
            Exporting SVG into JS is a good solution.
            You will have multiple exported variables that you can easily import in your project.
            Another benefit is being able to use tree shaking
            to load only icons that you really need.
        </p>
        <ComponentsAsES6DataUrl />
        <ComponentsAsES6Base64 />
    </div>
);

export default ComponentsAsES6;
