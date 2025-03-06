export type Options = {
  /**
   * Remove `style` attributes from SVG definitions, or a list of attributes to remove.
   * @default false
   */
  cleanDefs?: boolean | string[];
  /**
   * Remove `style` attributes from SVG objects, or a list of attributes to remove.
   * @default false
   */
  cleanSymbols?: boolean | string[];
  /**
   * A map of attributes to set on the root `<svg>` element.
   * If you set an attribute's value to null, you remove that attribute. Values may be functions like jQuery.
   * @default false
   */
  svgAttrs?: boolean | { [key: string]: unknown };
  /**
   * A map of attributes to set on each `<symbol>` element.
   * If you set an attribute's value to null, you remove that attribute. Values may be functions like jQuery.
   * @default false
   */
  symbolAttrs?: boolean | { [key: string]: unknown };
  /**
   * Attributes to have `svgstore` attempt to copy to the newly created `<symbol>` tag from it's source `<svg>` tag.
   * The `viewBox`, `aria-labelledby`, and `role` attributes are always copied.
   * @default false
   */
  copyAttrs?: boolean | string[];
  /**
   * Rename `defs` content ids to make them inherit files' names so that it would help to avoid defs with same ids in the output file.
   * @default false
   */
  renameDefs?: boolean;
};

type ToStringOptions = {
  /**
   * Don't output `<?xml ?>`, `DOCTYPE`, and the `xmlns` attribute.
   * @default false
   */
  inline?: boolean;
};

export interface SvgStore {
  /**
   * Appends a file to the sprite with the given `id`.
   * @param id Unique `id` for this SVG file.
   * @param svg Raw source of the SVG file.
   * @param options Same as the [options of svgstore()](https://github.com/svgstore/svgstore#svgstore-options),
   * but will only apply to this SVG file's `<symbol>`.
   * @returns The current `cheerio` instance.
   */
  add: (id: string, svg: string, options?: Options) => SvgStore;
  /**
   * Outputs sprite as a string of XML.
   * @param options
   * @returns
   */
  toString: (options: ToStringOptions) => string;
}
