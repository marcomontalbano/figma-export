/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const { expect } = chai;

const fs = require('fs');

const figmaDocument = require('../core/lib/_config.test');
const figma = require('../core/lib/figma');

const outputter = require('./index');

describe('outputter as svg', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should export all components into svg files', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const pages = figma.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledTwice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch('output/page1-Figma-Logo.svg');
        expect(writeFileSync.secondCall).to.be.calledWithMatch('output/page1-Search.svg');
    });
});
