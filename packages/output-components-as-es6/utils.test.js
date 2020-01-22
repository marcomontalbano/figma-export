const { expect } = chai;

const utils = require('./utils');

describe('utils', () => {
    it('getVariableName', async () => {
        expect(utils.getVariableName('a')).to.eql('a');
        expect(utils.getVariableName('a word')).to.eql('aWord');
        expect(utils.getVariableName('a-word')).to.eql('aWord');
        expect(utils.getVariableName('a/word')).to.eql('aWord');
        expect(utils.getVariableName('a\\word')).to.eql('aWord');
        expect(utils.getVariableName('a[wor]d')).to.eql('aWord');
        expect(utils.getVariableName('a [word]')).to.eql('aWord');
        expect(utils.getVariableName('a (word)')).to.eql('aWord');
        expect(utils.getVariableName('a {word}')).to.eql('aWord');
    });
});
