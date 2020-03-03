/* eslint-disable @typescript-eslint/no-explicit-any */
import { FigmaExport } from '@figma-export/types';

const svg = {
    domain: 'https://s3-us-west-2.amazonaws.com',
    path: '/figma-alpha-api/img/7d80/9a7f/49ce9d382e188bc37b1fa83f83ff7c3f',
    content: '<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>',
    get url(): string {
        return `${this.domain}${this.path}`;
    },
};

const componentWithNumber = {
    id: '12:3',
    name: '1-icon',
    type: 'COMPONENT',
};

const componentWithSlashedName = {
    id: '9:10',
    name: 'icon/eye',
    type: 'COMPONENT',
    svg: svg.content,
};

const component1: FigmaExport.ComponentNode = {
    ...({} as ComponentNode),
    id: '10:8',
    name: 'Figma-Logo',
    type: 'COMPONENT',
    svg: svg.content,
    figmaExport: {
        dirname: '.',
        basename: 'Figma-Logo',
    },
};

const component2: FigmaExport.ComponentNode = {
    ...({} as ComponentNode),
    id: '8:1',
    name: 'Search',
    type: 'COMPONENT',
    svg: svg.content,
    figmaExport: {
        dirname: '.',
        basename: 'Figma-Search',
    },
};

const component3: FigmaExport.ComponentNode = {
    ...({} as ComponentNode),
    id: '9:1',
    name: 'Login',
    type: 'COMPONENT',
    svg: svg.content,
    figmaExport: {
        dirname: '.',
        basename: 'Login',
    },
};

const group1: GroupNode = {
    ...({} as GroupNode),
    id: '26:0',
    name: 'A Group',
    type: 'GROUP',
    children: [component3],
};

const page1: PageNode = {
    ...({} as PageNode),
    id: '10:6',
    name: 'page1',
    type: 'PAGE',
    children: [
        component1,
        component2,
    ],
};

const page2: PageNode = {
    ...({} as PageNode),
    id: '10:7',
    name: 'page2',
    type: 'PAGE',
    children: [
        group1,
    ],
};

const createDocument = (props: any): DocumentNode => ({
    ...({} as DocumentNode),
    ...props,
});

const createPage = (children: any): DocumentNode => ({
    ...({} as DocumentNode),
    children: [{
        ...({} as PageNode),
        id: '10:8',
        name: 'fakePage',
        children,
    }],
});

export {
    componentWithNumber,
    componentWithSlashedName,
    component1,
    component2,
    component3,
    group1,
    page1,
    page2,
    svg,
    createPage,
    createDocument,
};
