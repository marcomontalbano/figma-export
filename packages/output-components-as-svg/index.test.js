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

    it('should create folder if component names contain slashes', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const fakePages = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPages(fakePages);

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync.firstCall).to.be.calledWithMatch('output/icon/fakePage-eye.svg');
    });

    describe('options', () => {
        const fakePages = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPages(fakePages);

        it('should be able to customize "basename"', async () => {
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getBasename: (options) => `${options.basename}.svg`,
            })(pages);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/icon/eye.svg');
        });

        it('should be able to customize "dirname"', async () => {
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getBasename: (options) => `${options.basename}.svg`,
                getDirname: (options) => `${options.pageName}/${options.dirname}`,
            })(pages);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/eye.svg');
        });
    });
});
