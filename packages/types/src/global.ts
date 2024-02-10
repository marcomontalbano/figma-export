import * as Figma from 'figma-js';

type NodeWithChildren = Extract<Figma.Node, { children: ReadonlyArray<Figma.Node> }>

export type ComponentExtras = {
    id: string;
    dirname: string;
    basename: string;
    pathToComponent: {
        name: string,
        type: NodeWithChildren['type']
    }[];
}

export type ComponentNode = (Figma.Component | Figma.Instance) & {
    figmaExport: ComponentExtras;
    svg: string;
}

export interface PageNode extends Figma.Canvas {
    components: ComponentNode[];
}

export type StringTransformer = (str: string) => Promise<string | undefined>

export type ComponentOutputter = (pages: PageNode[]) => Promise<void>

export type ComponentOutputterParamOption = {
    componentName: string;
    pageName: string;
} & ComponentExtras;

export type StyleNode = Figma.Style & Figma.Node

export type ComponentFilter = (component: Figma.Component | Figma.Instance) => boolean
