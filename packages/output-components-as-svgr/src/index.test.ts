import sinon from 'sinon';
import { expect } from 'chai';
import svgr from '@svgr/core';
import * as figmaDocument from '../../core/src/lib/_config.test';
import * as figma from '../../core/src/lib/figma';
import fs = require('fs');

import makeDir = require('make-dir');
import outputter = require('./index');

describe('outputter as svgr', () => {
    let writeFileSync;
    let svgrAsync;
    beforeEach(() => {
        sinon.stub(makeDir, 'sync').returnsArg(0);
        writeFileSync = sinon.stub(fs, 'writeFileSync');
        svgrAsync = sinon.stub(svgr, 'sync').returns('# code for react component #');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should export all components into jsx files plus one index.js for each folder', async () => {
        const fakePage = figmaDocument.createPage([figmaDocument.component1, figmaDocument.component2]);
        const pages = figma.getPages(fakePage);

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledThrice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/FigmaLogo.jsx');
        expect(writeFileSync.secondCall).to.be.calledWithMatch('output/fakePage/Search.jsx');
        expect(writeFileSync.thirdCall).to.be.calledWithMatch('output/fakePage/index.js', "export { default as FigmaLogo } from './FigmaLogo.jsx';");
    });

    it('should create folder if component names contain slashes', async () => {
        const fakePage = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPages(fakePage);

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledTwice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/Eye.jsx');
        expect(writeFileSync.secondCall).to.be.calledWithMatch('output/fakePage/icon/index.js');
    });

    describe('options', () => {
        const fakePage = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPages(fakePage);

        it('should be able to customize "dirname"', async () => {
            await outputter({
                output: 'output',
                getDirname: (options) => `${options.dirname}`,
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/icon/Eye.jsx');
            expect(writeFileSync.secondCall).to.be.calledWithMatch('output/icon/index.js', "from './Eye.jsx';");
        });

        it('should be able to customize "componentName"', async () => {
            await outputter({
                output: 'output',
                getComponentName: (options) => `${options.basename}`,
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/eye.jsx');
            expect(writeFileSync.secondCall).to.be.calledWithMatch('output/fakePage/icon/index.js', "from './eye.jsx';");
        });

        it('should be able to customize "fileExtension"', async () => {
            await outputter({
                output: 'output',
                getFileExtension: () => '.js',
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/Eye.js');
            expect(writeFileSync.secondCall).to.be.calledWithMatch('output/fakePage/icon/index.js', "from './Eye.js';");
        });

        it('should be able to customize "svgrConfig"', async () => {
            await outputter({
                output: 'output',
                getSvgrConfig: () => ({ native: true }),
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/Eye.jsx');
            expect(svgrAsync.firstCall).to.be.calledWithMatch(figmaDocument.componentWithSlashedName.svg, { native: true });
        });
    });
});
