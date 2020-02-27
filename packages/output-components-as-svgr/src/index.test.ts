import sinon from 'sinon';
import { expect } from 'chai';

import * as figmaDocument from '../../core/src/lib/_config.test';
import * as figma from '../../core/src/lib/figma';

import fs = require('fs');
import outputter = require('./index');

describe('outputter as svgr', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should export all components into jsx files plus one index.js for each folder', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const fakePage = figmaDocument.createPage([figmaDocument.component1, figmaDocument.component2]);
        const pages = figma.getPages(fakePage);

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledThrice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/FigmaLogo.jsx', 'function FigmaLogo(props) {');
        expect(writeFileSync.secondCall).to.be.calledWithMatch('output/fakePage/Search.jsx', 'function Search(props) {');
        expect(writeFileSync.thirdCall).to.be.calledWithMatch('output/fakePage/index.js', "export { default as FigmaLogo } from './FigmaLogo.jsx';");
    });

    it('should create folder if component names contain slashes', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
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
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getDirname: (options) => `${options.dirname}`,
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/icon/Eye.jsx', 'function Eye(props) {');
            expect(writeFileSync.secondCall).to.be.calledWithMatch('output/icon/index.js', "from './Eye.jsx';");
        });

        it('should be able to customize "componentName"', async () => {
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getComponentName: (options) => `${options.basename}`,
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/eye.jsx', 'function eye(props) {');
            expect(writeFileSync.secondCall).to.be.calledWithMatch('output/fakePage/icon/index.js', "from './eye.jsx';");
        });

        it('should be able to customize "fileExtension"', async () => {
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getFileExtension: () => '.js',
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/Eye.js', 'function Eye(props) {');
            expect(writeFileSync.secondCall).to.be.calledWithMatch('output/fakePage/icon/index.js', "from './Eye.js';");
        });

        it('should be able to customize "svgrConfig"', async () => {
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getSvgrConfig: () => ({ native: true }),
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch('output/fakePage/icon/Eye.jsx', 'from "react-native-svg"');
        });
    });
});
