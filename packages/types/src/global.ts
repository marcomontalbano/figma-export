import type * as Figma from '@figma/rest-api-spec';

type NodeWithChildren = Extract<
  Figma.Node,
  { children: ReadonlyArray<Figma.Node> }
>;

export type ComponentExtras = {
  id: string;
  dirname: string;
  basename: string;
  pathToComponent: {
    name: string;
    type: NodeWithChildren['type'];
  }[];
};

export type ComponentNode = (Figma.ComponentNode | Figma.InstanceNode) &
  Pick<Figma.Component, 'description' | 'documentationLinks'> & {
    figmaExport: ComponentExtras;
    svg: string;
  };

export interface PageNode extends Figma.CanvasNode {
  components: ComponentNode[];
}

export type StringTransformer = (str: string) => Promise<string | undefined>;

export type ComponentOutputter = (pages: PageNode[]) => Promise<void>;

export type ComponentOutputterParamOption = {
  componentName: string;
  pageName: string;
} & ComponentExtras;

export type StyleNode = Figma.Style & Figma.Node;

export type ComponentFilter = (
  component: Figma.ComponentNode | Figma.InstanceNode,
) => boolean;
