const { expect, test } = require('@oclif/test');

const figmaExport = require('@figma-export/core');

describe('components', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should stdout a proper message with a fileId and an outputter', () => {
        sinon.stub(figmaExport, 'components').returns(Promise.resolve());

        test
            .stdout()
            .command(['components', 'RSzpKJcnb6uBRQ3rOfLIyUs5', '-O', '@figma-export/output-components-as-svg'])
            .it((ctx) => {
                expect(ctx.stdout).to.contain('Exporting RSzpKJcnb6uBRQ3rOfLIyUs5 with [] as [@figma-export/output-components-as-svg]');
            });
    });

    it('should throw an error with invalid fields (rejection)', () => {
        sinon.stub(figmaExport, 'components').returns(Promise.reject(new Error('Something went wrong')));

        test
            .stdout()
            .command(['components', 'RSzpKJcnb6uBRQ3rOfLIyUs5', '-O', '@figma-export/output-components-as-svg'])
            .exit(true)
            .it();
    });
});
