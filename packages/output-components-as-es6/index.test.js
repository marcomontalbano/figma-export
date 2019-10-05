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
        const writeFileSync = sandbox.stub(fs, 'writeFileSync');
        const pages = utils.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch('output/figma-components.js', 'export const figmaLogo = `undefined`;');
    });

    it('should throw an error if component starts with a number', async () => {
        const page = {
            ...figmaDocument.page1,
            children: [figmaDocument.componentWithNumber],
        };

        sandbox.stub(fs, 'writeFileSync');

        const pages = utils.getPages({ children: [page] });
        const spyOutputter = sinon.spy(outputter);

        return spyOutputter({
            output: 'output',
        })(pages).then(() => {
            sinon.assert.fail();
        }).catch((err) => {
            expect(err).to.be.an('Error');
            expect(err.message).to.be.equal('"1-icon" - Component names cannot start with a number.');
        });
    });
});
