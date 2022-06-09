/* eslint-disable @typescript-eslint/no-explicit-any */
import * as FigmaExport from '@figma-export/types';
import * as Figma from 'figma-js';

export const svg = {
    domain: 'https://s3-us-west-2.amazonaws.com',
    path: '/figma-alpha-api/img/7d80/9a7f/49ce9d382e188bc37b1fa83f83ff7c3f',
    content: '<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>',
    get url(): string {
        return `${this.domain}${this.path}`;
    },
};

export const componentWithNumber = {
    id: '12:3',
    name: '1-icon',
    type: 'COMPONENT',
};

export const componentWithSlashedName: Figma.Node = {
    ...({} as Figma.Component),
    id: '9:10',
    name: 'icon/Figma-logo',
    type: 'COMPONENT',
};

export const componentWithSlashedNameOutput: FigmaExport.ComponentNode = {
    ...componentWithSlashedName,
    svg: svg.content,
    figmaExport: {
        id: '9:10',
        dirname: '.',
        basename: 'icon/Figma-logo',
    },
};

export const component1: Figma.Node = {
    ...({} as Figma.Component),
    id: '10:8',
    name: 'Figma-Logo',
    type: 'COMPONENT',
};

export const componentOutput1: FigmaExport.ComponentNode = {
    ...component1,
    svg: '',
    figmaExport: {
        id: '10:8',
        dirname: '.',
        basename: 'Figma-Logo',
    },
};

export const component2: Figma.Node = {
    ...({} as Figma.Component),
    id: '8:1',
    name: 'Search',
    type: 'COMPONENT',
};

export const componentOutput2: FigmaExport.ComponentNode = {
    ...component2,
    svg: '',
    figmaExport: {
        id: '8:1',
        dirname: '.',
        basename: 'Figma-Search',
    },
};

export const component3: Figma.Node = {
    ...({} as Figma.Component),
    id: '9:1',
    name: 'Login',
    type: 'COMPONENT',
};

export const componentOutput3: FigmaExport.ComponentNode = {
    ...component3,
    svg: '',
    figmaExport: {
        id: '9:1',
        dirname: '.',
        basename: 'Login',
    },
};

export const group1: Figma.Group = {
    ...({} as Figma.Group),
    id: '26:0',
    name: 'A Group',
    type: 'GROUP',
    children: [component3],
};

export const page1: Figma.Canvas = {
    ...({} as Figma.Canvas),
    id: '10:6',
    name: 'page1',
    type: 'CANVAS',
    children: [
        component1,
        component2,
    ],
};

export const page1WithSlashes: Figma.Canvas = {
    ...({} as Figma.Canvas),
    id: '10:6',
    name: 'page1/subpath/subsubpath',
    type: 'CANVAS',
    children: [
        component1,
        component2,
    ],
};

export const page2: Figma.Canvas = {
    ...({} as Figma.Canvas),
    id: '10:7',
    name: 'page2',
    type: 'CANVAS',
    children: [
        group1,
    ],
};

export const pageWithoutComponents: Figma.Canvas = {
    ...({} as Figma.Canvas),
    id: '10:7',
    name: 'page2',
    type: 'CANVAS',
    children: [],
};

export const createDocument = (props: any): Figma.Document => ({
    ...({} as Figma.Document),
    ...props,
});

export const createPage = (children: any): Figma.Document => ({
    ...({} as Figma.Document),
    children: [{
        ...({} as Figma.Canvas),
        id: '10:8',
        name: 'fakePage',
        children,
    }],
});
