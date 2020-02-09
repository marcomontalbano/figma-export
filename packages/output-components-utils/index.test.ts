const { expect } = chai;

const utils = require('./index');

describe('utils', () => {
    it('camelCase', async () => {
        expect(utils.camelCase('a')).to.eql('a');
        expect(utils.camelCase('a word')).to.eql('aWord');
        expect(utils.camelCase('a 5 number')).to.eql('a5Number');
        expect(utils.camelCase('with-dash')).to.eql('withDash');
        expect(utils.camelCase('with_lodash')).to.eql('withLodash');
        expect(utils.camelCase('with/slash')).to.eql('withSlash');
        expect(utils.camelCase('with\\backslash')).to.eql('withBackslash');
        expect(utils.camelCase('with [square]')).to.eql('withSquare');
        expect(utils.camelCase('with (round)')).to.eql('withRound');
        expect(utils.camelCase('with {curly}')).to.eql('withCurly');
        expect(utils.camelCase('Random[thIng]s')).to.eql('randomThIngS');
    });
});
