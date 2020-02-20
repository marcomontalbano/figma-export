// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FigmaExport {

    export type ComponentExtras = {
        dirname: string;
        basename: string;
    }

    export interface ComponentNode extends globalThis.ComponentNode {
        figmaExport: ComponentExtras;
        svg: string;
    }

    export interface PageNode extends globalThis.PageNode {
        components: ComponentNode[];
    }

    export type StringTransformer = (str: string) => Promise<string>

    export type Outputter = (pages: PageNode[]) => Promise<void>

    export type OptionType = {
        componentName: string;
        pageName: string;
    } & ComponentExtras;

}
