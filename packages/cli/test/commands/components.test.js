const { expect, test } = require('@oclif/test');

const figma = require('@figma-export/core');

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
            sandbox.stub(figma, 'exportComponents').returns(Promise.resolve());
        });

        test
            .stdout()
            .command(['components', 'RSzpKJcnb6uBRQ3rOfLIyUs5', '-O', '@figma-export/output-components-as-stdout'])
            .it('should stdout a proper message', (ctx) => {
                expect(ctx.stdout).to.contain('Export RSzpKJcnb6uBRQ3rOfLIyUs5 with [@figma-export/output-components-as-stdout]');
            });
    });

    describe('with invalid fields (rejection)', () => {
        runInSandbox((sandbox) => {
            sandbox.stub(figma, 'setToken');
            sandbox.stub(figma, 'exportComponents').returns(Promise.reject(new Error('Something went wrong')));
        });

        test
            .stdout()
            .command(['components', 'RSzpKJcnb6uBRQ3rOfLIyUs5', '-O', '@figma-export/output-components-as-stdout'])
            .exit(true)
            .it('should throw an error');
    });
});
