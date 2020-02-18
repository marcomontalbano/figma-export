declare module 'svgstore' {
    interface SvgStore {
        add: (id: string, svg: string, options?: {}) => SvgStore;
        toString: (options: {}) => string;
    }

    function svgstore(options: {}): SvgStore;
    export = svgstore;
}
