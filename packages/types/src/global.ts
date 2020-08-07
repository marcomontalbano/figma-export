import * as Figma from 'figma-js';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FigmaExport {

    export type ComponentExtras = {
        dirname: string;
        basename: string;
    }

    export interface ComponentNode extends Figma.Component {
        figmaExport: ComponentExtras;
        svg: string;
    }

    export interface PageNode extends Figma.Canvas {
        components: ComponentNode[];
    }

    export type StringTransformer = (str: string) => Promise<string>

    export type Outputter = (pages: PageNode[]) => Promise<void>

    export type OutputterParamOption = {
        componentName: string;
        pageName: string;
    } & ComponentExtras;

}
