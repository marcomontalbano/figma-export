/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const { expect } = chai;

const fs = require('fs');

const figmaDocument = require('../core/lib/_config.test');
const figma = require('../core/lib/figma');

const outputter = require('./index');

describe('outputter as es6', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should export all components into an es6 file', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const pages = figma.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1.js',
            'export const figmaLogo = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;',
        );
    });

    it('should export all components into an es6 file using base64 encoding if set', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const pages = figma.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
            useBase64: true,
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1.js',
            // eslint-disable-next-line max-len
            'export const figmaLogo = `PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA0MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=`;',
        );
    });

    it('should export all components into an es6 file using dataUri if set', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const pages = figma.getPages({ children: [figmaDocument.page1] });

        await outputter({
            output: 'output',
            useDataUri: true,
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1.js',
            // eslint-disable-next-line max-len
            "export const figmaLogo = `data:image/svg+xml,%3csvg width='40' height='60' viewBox='0 0 40 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3c/svg%3e`;",
        );
    });

    it('should throw an error if component starts with a number', async () => {
        const page = {
            ...figmaDocument.page1,
            children: [figmaDocument.componentWithNumber],
        };

        sinon.stub(fs, 'writeFileSync');

        const pages = figma.getPages({ children: [page] });
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
