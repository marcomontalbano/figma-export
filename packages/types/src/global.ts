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

export interface ComponentNode extends Figma.Component {
    figmaExport: ComponentExtras;
    svg: string;
}

export interface PageNode extends Figma.Global {
    components: ComponentNode[];
}

export type StringTransformer = (str: string) => Promise<string | undefined>

export type ComponentOutputter = (pages: PageNode[]) => Promise<void>

export type ComponentOutputterParamOption = {
    componentName: string;
    pageName: string;
} & ComponentExtras;

export type StyleNode = Figma.Style & Figma.Node

export type ComponentFilter = (component: Figma.Component) => boolean
