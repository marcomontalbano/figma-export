import { expect } from 'chai';

import { writeVariable } from './utils';

describe('utils', () => {
    describe('writeVariable', () => {
        describe('SCSS', () => {
            const extension = 'SCSS';

            it('should return empty string is the value is empty', () => {
                const text = writeVariable(
                    'This is a comment',
                    'variable-name', '',
                    extension,
                );

                expect(text).to.eql('');
            });

            it('should be able to print-out simple variable', () => {
                const text = writeVariable(
                    'This is a comment',
                    'variable-name', '#fff',
                    extension,
                );

                expect(text).to.eql(
                    // eslint-disable-next-line indent
                      '\n'
                    + '/**\n'
                    + ' * This is a comment\n'
                    + ' */\n'
                    + '$variable-name: #fff;\n',
                );
            });

            it('should be able to print-out simple variable with an empty comment', () => {
                const text = writeVariable('', 'variable-name', '#fff', extension);
                expect(text).to.eql('\n\n$variable-name: #fff;\n');
            });

            it('should be able to print-out a comment in multiline', () => {
                const text = writeVariable(
                    'This is a comment\nin two lines',
                    'variable-name', '#fff',
                    extension,
                );

                expect(text).to.eql(
                    // eslint-disable-next-line indent
                      '\n'
                    + '/**\n'
                    + ' * This is a comment\n'
                    + ' * in two lines\n'
                    + ' */\n'
                    + '$variable-name: #fff;\n',
                );
            });

            it('should be able to print-out a complex variable (like a sass:map)', () => {
                const text = writeVariable(
                    'This is a comment\nin two lines',
                    'variable-name', '(\n"color-1": #fff,\n"color-2": #000\n)',
                    extension,
                );

                expect(text).to.eql(
                    // eslint-disable-next-line indent
                      '\n'
                    + '/**\n'
                    + ' * This is a comment\n'
                    + ' * in two lines\n'
                    + ' */\n'
                    + '$variable-name: (\n'
                    + '  "color-1": #fff,\n'
                    + '  "color-2": #000\n'
                    + ');\n',
                );
            });
        });

        describe('SASS', () => {
            const extension = 'SASS';

            it('should return empty string is the value is empty', () => {
                const text = writeVariable(
                    'This is a comment',
                    'variable-name', '',
                    extension,
                );

                expect(text).to.eql('');
            });

            it('should be able to print-out simple variable', () => {
                const text = writeVariable(
                    'This is a comment',
                    'variable-name', '#fff',
                    extension,
                );

                expect(text).to.eql(
                    // eslint-disable-next-line indent
                      '\n'
                    + '/**\n'
                    + ' * This is a comment\n'
                    + ' */\n'
                    + '$variable-name: #fff\n',
                );
            });

            it('should be able to print-out simple variable with an empty comment', () => {
                const text = writeVariable('', 'variable-name', '#fff', extension);
                expect(text).to.eql('\n\n$variable-name: #fff\n');
            });

            it('should be able to print-out a comment in multiline', () => {
                const text = writeVariable(
                    'This is a comment\nin two lines',
                    'variable-name', '#fff',
                    extension,
                );

                expect(text).to.eql(
                    // eslint-disable-next-line indent
                      '\n'
                    + '/**\n'
                    + ' * This is a comment\n'
                    + ' * in two lines\n'
                    + ' */\n'
                    + '$variable-name: #fff\n',
                );
            });

            it('should be able to print-out a complex variable (like a sass:map)', () => {
                const text = writeVariable(
                    'This is a comment\nin two lines',
                    'variable-name', '(\n"color-1": #fff,\n"color-2": #000\n)',
                    extension,
                );

                expect(text).to.eql(
                    // eslint-disable-next-line indent
                      '\n'
                    + '/**\n'
                    + ' * This is a comment\n'
                    + ' * in two lines\n'
                    + ' */\n'
                    + '$variable-name: ( "color-1": #fff, "color-2": #000 )\n',
                );
            });
        });
    });
});
