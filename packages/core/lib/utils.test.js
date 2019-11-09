/* eslint-disable import/no-extraneous-dependencies */

const { expect } = chai;
const nock = require('nock');

const utils = require('./utils');

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
            nock('https://example.com', { reqheaders: { 'Content-Type': 'images/svg+xml' } })
                .get('/image.svg')
                .reply(200, '<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>');

            const svg = await utils.fetchAsSvgXml('https://example.com/image.svg');
            expect(svg).to.deep.equal('<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>');
        });
    });
});
