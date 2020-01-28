/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const { expect } = chai;

const fs = require('fs');

const figmaDocument = require('../core/lib/_config.test');
const figma = require('../core/lib/figma');

const outputter = require('./index');

describe('outputter as svgstore', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should create an svg with the page name as filename', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const pages = figma.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch('output/page1.svg');
        expect(writeFileSync.getCall(0).args[1].toString()).to.be.contain('id="page1/Figma-Logo"');
    });
});
