export type Options = {
  cleanDefs?: boolean | string[];
  cleanSymbols?: boolean | string[];
  svgAttrs?: boolean | { [key: string]: unknown };
  symbolAttrs?: boolean | { [key: string]: unknown };
  copyAttrs?: boolean | string[];
  renameDefs?: boolean;
};

type ToStringOptions = {
  inline?: boolean;
};

export interface SvgStore {
  add: (id: string, svg: string, options?: Options) => SvgStore;
  toString: (options: ToStringOptions) => string;
}
