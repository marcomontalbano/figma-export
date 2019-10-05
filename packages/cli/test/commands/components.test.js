const { expect, test } = require('@oclif/test');

const figma = require('@figma-export/core');

const utils = require('../../src/utils');

const runInSandbox = (run) => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        run(sandbox);
    });

    after(() => {
        sandbox.restore();
    });
};

describe('components', () => {
    describe('with a fileId and an outputter', () => {
        runInSandbox((sandbox) => {
            sandbox.stub(figma, 'setToken');
            sandbox.stub(utils, 'mkdirRecursive');
            sandbox.stub(figma, 'exportComponents').returns(Promise.resolve());
        });

        test
            .stdout()
            .command(['components', 'RSzpKJcnb6uBRQ3rOfLIyUs5', '-O', '@figma-export/output-components-as-svg'])
            .it('should stdout a proper message', (ctx) => {
                expect(ctx.stdout).to.contain('Exporting RSzpKJcnb6uBRQ3rOfLIyUs5 with [] as [@figma-export/output-components-as-svg]');
            });
    });

    describe('with invalid fields (rejection)', () => {
        runInSandbox((sandbox) => {
            sandbox.stub(figma, 'setToken');
            sandbox.stub(utils, 'mkdirRecursive');
            sandbox.stub(figma, 'exportComponents').returns(Promise.reject(new Error('Something went wrong')));
        });

        test
            .stdout()
            .command(['components', 'RSzpKJcnb6uBRQ3rOfLIyUs5', '-O', '@figma-export/output-components-as-svg'])
            .exit(true)
            .it('should throw an error');
    });
});
