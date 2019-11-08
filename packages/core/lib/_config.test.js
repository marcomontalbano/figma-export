
const componentWithNumber = {
    id: '12:3',
    name: '1-icon',
    type: 'COMPONENT',
};

const component1 = {
    id: '10:8',
    name: 'Figma-Logo',
    type: 'COMPONENT',
};

const component2 = {
    id: '8:1',
    name: 'Search',
    type: 'COMPONENT',
};

const component3 = {
    id: '9:1',
    name: 'Login',
    type: 'COMPONENT',
};

const group1 = {
    id: '26:0',
    name: 'A Group',
    type: 'GROUP',
    children: [component3],
};

const page1 = {
    id: '10:6',
    name: 'page1',
    type: 'CANVAS',
    children: [
        component1,
        component2,
    ],
};

const page2 = {
    id: '10:7',
    name: 'page2',
    type: 'CANVAS',
    children: [
        group1,
    ],
};

const svg = {
    domain: 'https://s3-us-west-2.amazonaws.com',
    path: '/figma-alpha-api/img/7d80/9a7f/49ce9d382e188bc37b1fa83f83ff7c3f',
    content: '<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>',
    get url() {
        return `${this.domain}${this.path}`;
    },
};

module.exports = {
    componentWithNumber,
    component1,
    component2,
    component3,
    group1,
    page1,
    page2,
    svg,
};
