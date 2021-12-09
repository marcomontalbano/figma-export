import ComponentsAsSvgstoreDefault from './ComponentsAsSvgstore_default';
import ComponentsAsSvgstoreMonochrome from './ComponentsAsSvgstore_monochrome';

const ComponentsAsSvgstore = () => (
    <div class="section-block container text-center">
        <h3 id="svg-sprites"><code class="figma-gradient with-opacity-10">SVG Sprites</code></h3>
        <div>
            Probably you already know what <a target="_blank" rel="noopener noreferrer" href="https://css-tricks.com/css-sprites/">CSS Sprites</a> are,
            basically you can combine multiple images into a single image file and use it on a website.
            SVG Sprites are very similar, but you will use .svg instead of .png. Discover more on this article
            "<a target="_blank" rel="noopener noreferrer" href="https://css-tricks.com/svg-sprites-use-better-icon-fonts/">Icon System with SVG Sprites</a>"
            where you will also find how to use this technique.
        </div>
        <ComponentsAsSvgstoreDefault />
        <ComponentsAsSvgstoreMonochrome />
    </div>
);

export default ComponentsAsSvgstore;
