// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Config, State } from './src/svgr';

declare global {
    export function sync(svg: string, config: Config, state: State): string;
}
