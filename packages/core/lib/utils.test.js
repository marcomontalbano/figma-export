/* eslint-disable import/no-extraneous-dependencies */

const { expect } = require('chai');
const nock = require('nock');

const utils = require('./utils');

const component1 = {
    id: '10:8',
    name: 'figma-logo',
    type: 'COMPONENT',
};

const component2 = {
    id: '8:1',
    name: 'search',
    type: 'COMPONENT',
};

const group1 = {
    id: '26:0',
    name: 'A Group',
    type: 'GROUP',
    children: [component2],
};

const page1 = {
    id: '10:6',
    name: 'page1',
    type: 'CANVAS',
    children: [
        component1,
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

module.exports = {
    component1,
    component2,
    group1,
    page1,
    page2,
};

describe('utils.', () => {
    describe('toArray', () => {
        it('should convert the element into an array if the element is not an array. If is already an array, just returns it', () => {
            expect(utils.toArray()).to.eql([]);
            expect(utils.toArray('this is a string')).to.eql(['this is a string']);
            expect(utils.toArray(2)).to.eql([2]);
            expect(utils.toArray([5])).to.eql([5]);
            expect(utils.toArray({ key: 'value' })).to.eql([{ key: 'value' }]);
        });
    });

    describe('fromEntries', () => {
        it('should works as Object.fromEntries', () => {
            const entries = [
                ['firstname', 'john'],
                ['lastname', 'doe'],
            ];
            expect(utils.fromEntries(entries)).to.eql({
                firstname: 'john',
                lastname: 'doe',
            });
        });
    });

    describe('combineKeysAndValuesIntoObject', () => {
        it('should get all components from a list of children', () => {
            expect(utils.combineKeysAndValuesIntoObject(
                ['a', 'b'],
                [1, 2],
            )).to.eql({ a: 1, b: 2 });
        });
    });

    describe('promiseSequentially', () => {
        it('should resolve promises sequentially', async () => {
            const result = utils.promiseSequentially([
                (p) => Promise.resolve(`${p}e`),
                (p) => Promise.resolve(`${p}l`),
                (p) => Promise.resolve(`${p}l`),
                (p) => Promise.resolve(`${p}o`),
            ], 'h');

            expect(await result).to.be.equal('hello');
        });
    });

    describe('fetchAsSvgXml', () => {
        it('should throw a TypeError if the url is not valid', () => {
            expect(() => {
                utils.fetchAsSvgXml();
            }).to.throw(TypeError, 'Only absolute URLs are supported');

            expect(() => {
                utils.fetchAsSvgXml('this is not a url!');
            }).to.throw(TypeError, 'Only absolute URLs are supported');
        });

        it('should fetch the svg code from a url', async () => {
            nock('https://s3-us-west-2.amazonaws.com', { reqheaders: { 'Content-Type': 'images/svg+xml' } })
                .get('/figma-alpha-api/img/7d80/9a7f/49ce9d382e188bc37b1fa83f83ff7c3f')
                .reply(200, '<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>');

            const svgUrl = 'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/7d80/9a7f/49ce9d382e188bc37b1fa83f83ff7c3f';
            const svg = await utils.fetchAsSvgXml(svgUrl);

            expect(svg).to.deep.equal('<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>');
        });
    });

    describe('getComponents', () => {
        it('should get zero results if no children are provided', () => {
            expect(utils.getComponents()).to.eql({});
        });

        it('should get all components from a list of children', () => {
            expect(utils.getComponents([
                component1,
                page2,
            ])).to.eql({
                [component1.name]: component1,
                [component2.name]: component2,
            });
        });
    });

    describe('getIdsFromPages', () => {
        it('should get component ids from specified pages', () => {
            const pages = utils.getPages({ children: [page1, page2] }, {
                only: 'page2',
            });

            expect(utils.getIdsFromPages(pages)).to.eql(['8:1']);
        });
    });

    describe('getPages', () => {
        it('should get all pages by default', () => {
            expect(utils.getPages({ children: [page1, page2] })).to.have.all.keys('page1', 'page2');
        });

        it('should get all pages if "empty" list is provided', () => {
            expect(utils.getPages({ children: [page1, page2] }, {
                only: [''],
            })).to.have.all.keys('page1', 'page2');

            expect(utils.getPages({ children: [page1, page2] }, {
                only: [],
            })).to.have.all.keys('page1', 'page2');

            expect(utils.getPages({ children: [page1, page2] }, {
                only: '',
            })).to.have.all.keys('page1', 'page2');
        });

        it('should get all requested pages', () => {
            expect(utils.getPages({ children: [page1, page2] }, {
                only: 'page2',
            })).to.have.all.keys('page2');

            expect(utils.getPages({ children: [page1, page2] }, {
                only: ['page1', 'page2'],
            })).to.have.all.keys('page1', 'page2');
        });

        it('should get zero results if a non existing page is provided', () => {
            const asd = utils.getPages({ children: [page1, page2] }, {
                only: 'page20',
            });

            expect(asd).to.be.an('object').that.is.empty;
        });
    });
});
