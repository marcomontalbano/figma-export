import type * as Figma from '@figma/rest-api-spec';
import type * as FigmaExport from '@figma-export/types';

export const svg = {
  domain: 'https://s3-us-west-2.amazonaws.com',
  path: '/figma-alpha-api/img/7d80/9a7f/49ce9d382e188bc37b1fa83f83ff7c3f',
  content:
    '<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>',
  get url(): string {
    return `${this.domain}${this.path}`;
  },
};

export const componentWithNumber: Figma.SubcanvasNode = {
  ...({} as Figma.ComponentNode),
  id: '12:3',
  name: '1-icon',
  type: 'COMPONENT',
};

export const componentWithSlashedName: Figma.SubcanvasNode = {
  ...({} as Figma.ComponentNode),
  id: '9:10',
  name: 'icon/Figma-logo',
  type: 'COMPONENT',
};

export const componentWithSlashedNameOutput: FigmaExport.ComponentNode = {
  ...componentWithSlashedName,
  description: '',
  documentationLinks: [],
  svg: svg.content,
  figmaExport: {
    id: '9:10',
    dirname: '.',
    basename: 'icon/Figma-logo',
    pathToComponent: [],
  },
};

export const component1: Figma.SubcanvasNode = {
  ...({} as Figma.ComponentNode),
  id: '10:8',
  name: 'Figma-Logo',
  type: 'COMPONENT',
};

export const componentOutput1: FigmaExport.ComponentNode = {
  ...component1,
  description: 'The official Figma logo',
  documentationLinks: [{ uri: 'https://www.figma.com' }],
  svg: '',
  figmaExport: {
    id: '10:8',
    dirname: '.',
    basename: 'Figma-Logo',
    pathToComponent: [{ name: 'A Frame', type: 'FRAME' }],
  },
};

export const instanceComponent1: Figma.SubcanvasNode = {
  ...({} as Figma.InstanceNode),
  id: '10:98',
  name: 'Figma-Logo (INSTANCE)',
  type: 'INSTANCE',
  componentId: '10:8',
};

export const instanceComponentOutput1: FigmaExport.ComponentNode = {
  ...instanceComponent1,
  description: '',
  documentationLinks: [],
  svg: '',
  figmaExport: {
    id: '10:98',
    dirname: '.',
    basename: 'Figma-Logo (INSTANCE)',
    pathToComponent: [
      { name: 'A Frame', type: 'FRAME' },
      { name: 'A Group', type: 'GROUP' },
    ],
  },
};

export const component2: Figma.SubcanvasNode = {
  ...({} as Figma.ComponentNode),
  id: '8:1',
  name: 'Search',
  type: 'COMPONENT',
};

export const componentOutput2: FigmaExport.ComponentNode = {
  ...component2,
  description: '',
  documentationLinks: [],
  svg: '',
  figmaExport: {
    id: '8:1',
    dirname: '.',
    basename: 'Figma-Search',
    pathToComponent: [],
  },
};

export const component3: Figma.SubcanvasNode = {
  ...({} as Figma.ComponentNode),
  id: '9:1',
  name: 'Login',
  type: 'COMPONENT',
};

export const componentOutput3: FigmaExport.ComponentNode = {
  ...component3,
  description: '',
  documentationLinks: [],
  svg: '',
  figmaExport: {
    id: '9:1',
    dirname: '.',
    basename: 'Login',
    pathToComponent: [
      { name: 'A Frame', type: 'FRAME' },
      { name: 'A Group', type: 'GROUP' },
    ],
  },
};

export const group1: Figma.GroupNode = {
  ...({} as Figma.GroupNode),
  id: '26:0',
  name: 'A Group',
  type: 'GROUP',
  children: [instanceComponent1, component3],
};

export const page1: Figma.CanvasNode = {
  ...({} as Figma.CanvasNode),
  id: '10:6',
  name: 'page1',
  type: 'CANVAS',
  children: [component1, component2],
};

export const page1WithSlashes: Figma.CanvasNode = {
  ...({} as Figma.CanvasNode),
  id: '10:6',
  name: 'page1/subpath/subsubpath',
  type: 'CANVAS',
  children: [component1, component2],
};

export const page2: Figma.CanvasNode = {
  ...({} as Figma.CanvasNode),
  id: '10:7',
  name: 'page2',
  type: 'CANVAS',
  children: [group1],
};

export const pageWithoutComponents: Figma.CanvasNode = {
  ...({} as Figma.CanvasNode),
  id: '10:7',
  name: 'page2',
  type: 'CANVAS',
  children: [],
};

export const createFile = (props: {
  document: Figma.GetFileResponse['document'];
  components: Figma.GetFileResponse['components'];
}): Figma.GetFileResponse => ({
  ...({} as Figma.GetFileResponse),
  ...props,
});

export const createDocument = (
  props: Partial<Figma.DocumentNode>,
): Figma.DocumentNode => ({
  ...({} as Figma.DocumentNode),
  ...props,
});

// biome-ignore lint/suspicious/noExplicitAny: TODO: fix this
export const createPage = (children: any): Figma.DocumentNode => ({
  ...({} as Figma.DocumentNode),
  type: 'DOCUMENT',
  children: [
    {
      ...({} as Figma.CanvasNode),
      type: 'CANVAS',
      id: '10:8',
      name: 'fakePage',
      children,
    },
  ],
});
