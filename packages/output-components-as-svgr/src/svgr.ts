/**
 * SVGR ships with a handful of customizable options, usable in both the CLI and API.
 * https://react-svgr.com/docs/options/
 */
export type Config = {
    [key: string]: unknown
}

export type State = {
    componentName: string
    [key: string]: unknown
};

// /**
//  * SVGR ships with a handful of customizable options, usable in both the CLI and API.
//  * https://react-svgr.com/docs/options/
//  */
// export type Config = {
//     /** Specify a custom config file. */
//     configFile?: string

//     /** Specify a custom extension for generated files. */
//     ext?: string

//     /** Replace SVG "width" and "height" value by "1em" in order to make SVG size inherits from text size. */
//     icon?: boolean

//     /**
//      * Modify all SVG nodes with uppercase and use a specific template with react-native-svg imports. All unsupported nodes will be removed.
//      * Override using the API with native: { expo: true } to template SVG nodes with the ExpoKit SVG package.
//      * This is only necessary for 'ejected' ExpoKit projects where import 'react-native-svg' results in an error.
//      */
//     native?: boolean | { expo: true }

//     /** Generates .tsx files with TypeScript typings. */
//     typescript?: boolean

//     /** Remove width and height from root SVG tag. */
//     dimensions?: boolean

//     /** All properties given to component will be forwarded on SVG tag. Possible values: "start", "end" or false ("none" in CLI). */
//     expandProps?: 'start' | 'end' | false

//     /** Use Prettier to format JavaScript code output. */
//     prettier?: boolean

//     /**
//      * Specify Prettier config.
//      * https://prettier.io/docs/en/options.html
//      */
//     prettierConfig?: Record<string, unknown>

//     /** Use SVGO to optimize SVG code before transforming it into a component. */
//     svgo?: boolean

//     /**
//      * Specify SVGO config.
//      * https://gist.github.com/pladaria/69321af86ce165c2c1fc1c718b098dd0
//      */
//     svgoConfig?: Record<string, unknown>

//     /** Setting this to true will forward ref to the root SVG tag. */
//     ref?: boolean

//     /** Setting this to true will wrap the exported component in React.memo. */
//     memo?: boolean

//     /**
//      * Replace an attribute value by an other.
//      * The main usage of this option is to change an icon color to "currentColor" in order to inherit from text color.
//      */
//     replaceAttrValues?: Record<string, unknown>

//     /** Add props to the root SVG tag. */
//     svgProps?: Record<string, unknown>

//     /**
//      * Add title tag via title property.
//      * If titleProp is set to true and no title is provided (title={undefined}) at render time,
//      * this will fallback to existing title element in the svg if exists.
//      */
//     titleProp?: boolean

//     /**
//      * Specify a template file (CLI) or a template function (API) to use. For an example of template, see the default one.
//      * https://github.com/gregberge/svgr/tree/master/packages/babel-plugin-transform-svg-component/src/index.js
//      */
//     // eslint-disable-next-line @typescript-eslint/ban-types
//     template?: Function

//     /** Output files into a directory. */
//     outDir?: string

//     /**
//      * Specify a template function (API) to change default index.js output (when --out-dir is used).
//      * https://github.com/gregberge/svgr/blob/master/packages/cli/src/dirCommand.js
//      */
//     indexTemplate?: (filePaths: string[]) => string

//     /** When used with --out-dir, it ignores already existing files. */
//     ignoreExisting?: boolean
// };
