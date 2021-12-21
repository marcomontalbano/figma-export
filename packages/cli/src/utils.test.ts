import { expect } from 'chai';
import { asArray, requirePackages } from './utils';

describe('Utils', () => {
    describe('requirePackages', () => {
        it('should require a package given a relative path', () => {
            expect(requirePackages([])).to.deep.equal([]);

            expect(requirePackages(['./utils.requirePackages.mock.js'], { param: 1 })).to.deep.equal([{ param: 1 }]);
        });
    });

    describe('asArray', () => {
        it('should return an empty array when the argument is not defined', () => {
            expect(asArray(undefined)).to.deep.equal([]);
            expect(asArray(null)).to.deep.equal([]);
        });

        it('should return an array containing the passed value', () => {
            expect(asArray(3)).to.deep.equal([3]);
            expect(asArray('john')).to.deep.equal(['john']);
            expect(asArray(true)).to.deep.equal([true]);
        });

        it('should return the same array', () => {
            expect(asArray([3])).to.deep.equal([3]);
            expect(asArray(['john'])).to.deep.equal(['john']);
            expect(asArray([true])).to.deep.equal([true]);
            expect(asArray(['john', 3, false])).to.deep.equal(['john', 3, false]);
        });
    });
});
