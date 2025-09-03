import SvgOcticons from './SvgOcticons';

const Title = () => (
  <div className="container hero figma-gradient with-opacity-05">
    <section>
      <h1 className="figma-gradient text title">@figma-export</h1>
      <p>Export tool for Figma</p>
      <p>
        You can easily and automatically export your figma{' '}
        <code className="figma-gradient with-opacity-10">components</code> and{' '}
        <code className="figma-gradient with-opacity-10">styles</code> and use
        them directly into your website
      </p>
    </section>
    <SvgOcticons />
  </div>
);

export default Title;
