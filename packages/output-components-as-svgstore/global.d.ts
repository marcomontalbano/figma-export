// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Options, SvgStore } from './src/svgstore';

declare global {
    export function svgstore(options: Options): SvgStore;
}
