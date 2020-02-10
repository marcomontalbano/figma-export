import { camelCase } from './index';

const { expect } = chai;

describe('utils', () => {
    it('camelCase', async () => {
        expect(camelCase('a')).to.eql('a');
        expect(camelCase('a word')).to.eql('aWord');
        expect(camelCase('a 5 number')).to.eql('a5Number');
        expect(camelCase('with-dash')).to.eql('withDash');
        expect(camelCase('with_lodash')).to.eql('withLodash');
        expect(camelCase('with/slash')).to.eql('withSlash');
        expect(camelCase('with\\backslash')).to.eql('withBackslash');
        expect(camelCase('with [square]')).to.eql('withSquare');
        expect(camelCase('with (round)')).to.eql('withRound');
        expect(camelCase('with {curly}')).to.eql('withCurly');
        expect(camelCase('Random[thIng]s')).to.eql('randomThIngS');
    });
});
