const { expect } = chai;

const utils = require('./index');

describe('utils', () => {
    it('getVariableName', async () => {
        expect(utils.camelCase('a')).to.eql('a');
        expect(utils.camelCase('a word')).to.eql('aWord');
        expect(utils.camelCase('a-word')).to.eql('aWord');
        expect(utils.camelCase('a/word')).to.eql('aWord');
        expect(utils.camelCase('a\\word')).to.eql('aWord');
        expect(utils.camelCase('a[wor]d')).to.eql('aWord');
        expect(utils.camelCase('a [word]')).to.eql('aWord');
        expect(utils.camelCase('a (word)')).to.eql('aWord');
        expect(utils.camelCase('a {word}')).to.eql('aWord');
    });
});
