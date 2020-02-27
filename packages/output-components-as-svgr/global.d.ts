declare module '@svgr/core' {
    type config = {};
    type state = {};
    function sync(svg: string, config: config, state: state): string;
}
