/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const { expect } = chai;

const fs = require('fs');

const utils = require('../core/lib/utils');
const figmaDocument = require('../core/lib/utils.test');

const outputter = require('./index');

describe('outputter as es6', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should export all components into an es6 file', async () => {
        const writeFile = sandbox.stub(fs, 'writeFile');
        const pages = utils.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFile).to.be.calledWithMatch('output/figma-components.js', 'export const figmaLogo = `undefined`;');
    });
});
