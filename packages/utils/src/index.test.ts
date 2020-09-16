import { expect } from 'chai';

import { camelCase, pascalCase } from './index';

describe('utils', () => {
    it('camelCase', async () => {
        expect(camelCase('')).to.eql('');
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

    it('pascalCase', async () => {
        expect(pascalCase('')).to.eql('');
        expect(pascalCase('a')).to.eql('A');
        expect(pascalCase('a word')).to.eql('AWord');
        expect(pascalCase('a 5 number')).to.eql('A5Number');
        expect(pascalCase('with-dash')).to.eql('WithDash');
        expect(pascalCase('with_lodash')).to.eql('WithLodash');
        expect(pascalCase('with/slash')).to.eql('WithSlash');
        expect(pascalCase('with\\backslash')).to.eql('WithBackslash');
        expect(pascalCase('with [square]')).to.eql('WithSquare');
        expect(pascalCase('with (round)')).to.eql('WithRound');
        expect(pascalCase('with {curly}')).to.eql('WithCurly');
        expect(pascalCase('Random[thIng]s')).to.eql('RandomThIngS');
    });
});
