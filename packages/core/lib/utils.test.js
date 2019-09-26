const chai = require('chai');
const expect = chai.expect;

const utils = require('./utils');

const component_1 = {
    id: '10:8',
    name: 'figma-logo',
    type: 'COMPONENT',
};

const component_c2 = {
    id: '8:1',
    name: 'search',
    type: 'COMPONENT',
};

const group_1 = {
    id: '26:0',
    name: 'A Group',
    type: 'GROUP',
    children: [component_c2]
};

const page_1 = {
    id: '10:6',
    name: 'page1',
    type: 'CANVAS',
    children: [
        component_1
    ]
};

const page_2 = {
    id: '10:7',
    name: 'page2',
    type: 'CANVAS',
    children: [
        group_1
    ]
};


describe('Core', () => {
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

        describe('getComponents', () => {
            it('should get zero results if no children are provided', () => {
                expect(utils.getComponents()).to.eql({});
            });

            it('should get all components from a list of children', () => {
                expect(utils.getComponents([
                    component_1,
                    page_2
                ])).to.eql({
                    [component_1.name]: component_1,
                    [component_c2.name]: component_c2,
                });
            });
        });

        describe('getPages', () => {
            it('should get all pages by default', () => {
                expect(utils.getPages({ children: [page_1, page_2] })).to.have.all.keys('page1', 'page2');
            });

            it('should get all pages if "empty" list is provided', () => {
                expect(utils.getPages({ children: [page_1, page_2] }, {
                    only: ['']
                })).to.have.all.keys('page1', 'page2');

                expect(utils.getPages({ children: [page_1, page_2] }, {
                    only: []
                })).to.have.all.keys('page1', 'page2');

                expect(utils.getPages({ children: [page_1, page_2] }, {
                    only: ''
                })).to.have.all.keys('page1', 'page2');
            });

            it('should get all requested pages', () => {
                expect(utils.getPages({ children: [page_1, page_2] }, {
                    only: 'page2'
                })).to.have.all.keys('page2');

                expect(utils.getPages({ children: [page_1, page_2] }, {
                    only: ['page1', 'page2']
                })).to.have.all.keys('page1', 'page2');
            });

            it('should get zero results if a non existing page is provided', () => {
                expect(utils.getPages({ children: [page_1, page_2] }, {
                    only: 'page20'
                })).to.be.an('object').that.is.empty;
            });
        });

        describe('combineKeysAndValuesIntoObject', () => {
            it('should get all components from a list of children', () => {
                expect(utils.combineKeysAndValuesIntoObject(
                    ['a', 'b'],
                    [1, 2])
                ).to.eql({'a': 1, 'b': 2});
            });
        });
    });
});
