/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const { expect } = chai;

const fs = require('fs');

const utils = require('../core/lib/utils');
const figmaDocument = require('../core/lib/utils.test');

const outputter = require('./index');

describe('outputter as svg', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should export all components into svg files', async () => {
        const writeFileSync = sandbox.stub(fs, 'writeFileSync');
        const pages = utils.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledTwice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch('output/page1-Figma-Logo.svg');
        expect(writeFileSync.secondCall).to.be.calledWithMatch('output/page1-Search.svg');
    });
});
