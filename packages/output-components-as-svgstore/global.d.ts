// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Options, SvgStore } from './src/svgstore.ts';

declare global {
  export function svgstore(options: Options): SvgStore;
}
