import { expect } from 'chai';

import { writeComment, writeVariable } from './utils.js';

describe('utils', () => {
    describe('writeComment', () => {
        it('should write a proper comment', () => {
            const text = writeComment('This is a comment');

            expect(text).to.eql(
                // eslint-disable-next-line indent
                    '\n'
                + '/**\n'
                + ' * This is a comment\n'
                + ' */\n',
            );
        });

        it('should be able to print-out a comment in multiline', () => {
            const text = writeComment('This is a comment\nin two lines');

            expect(text).to.eql(
                // eslint-disable-next-line indent
                    '\n'
                + '/**\n'
                + ' * This is a comment\n'
                + ' * in two lines\n'
                + ' */\n',
            );
        });
    });

    describe('writeVariable', () => {
        it('should return empty string is the value is empty', () => {
            const text = writeVariable('variable-name', '');
            expect(text).to.eql('');
        });

        it('should be able to print-out simple variable', () => {
            const text = writeVariable('variable-name', '#fff');
            expect(text).to.eql('--variable-name: #fff;\n');
        });
    });
});
