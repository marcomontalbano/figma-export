import { expect } from 'chai';

import {
    camelCase,
    kebabCase,
    pascalCase,
    snakeCase,
} from './index';

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

    it('snakeCase', async () => {
        expect(snakeCase('')).to.eql('');
        expect(snakeCase('a')).to.eql('a');
        expect(snakeCase('a word')).to.eql('a_word');
        expect(snakeCase('a 5 number')).to.eql('a_5_number');
        expect(snakeCase('with-dash')).to.eql('with_dash');
        expect(snakeCase('with_lodash')).to.eql('with_lodash');
        expect(snakeCase('with/slash')).to.eql('with_slash');
        expect(snakeCase('with\\backslash')).to.eql('with_backslash');
        expect(snakeCase('with [square]')).to.eql('with_square_');
        expect(snakeCase('with (round)')).to.eql('with_round_');
        expect(snakeCase('with {curly}')).to.eql('with_curly_');
        expect(snakeCase('Random[thIng]s')).to.eql('Random_thIng_s');
    });

    it('kebabCase', async () => {
        expect(kebabCase('')).to.eql('');
        expect(kebabCase('a')).to.eql('a');
        expect(kebabCase('a word')).to.eql('a-word');
        expect(kebabCase('a 5 number')).to.eql('a-5-number');
        expect(kebabCase('with-dash')).to.eql('with-dash');
        expect(kebabCase('with_lodash')).to.eql('with-lodash');
        expect(kebabCase('with/slash')).to.eql('with-slash');
        expect(kebabCase('with\\backslash')).to.eql('with-backslash');
        expect(kebabCase('with [square]')).to.eql('with-square-');
        expect(kebabCase('with (round)')).to.eql('with-round-');
        expect(kebabCase('with {curly}')).to.eql('with-curly-');
        expect(kebabCase('Random[thIng]s')).to.eql('Random-thIng-s');
    });
});
