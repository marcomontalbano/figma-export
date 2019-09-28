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
                    component1,
                    page2,
                ])).to.eql({
                    [component1.name]: component1,
                    [component2.name]: component2,
                });
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
    });
});
