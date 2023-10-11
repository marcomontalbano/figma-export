import * as sinon from 'sinon';
import { expect } from 'chai';
import * as figmaDocument from '../../core/src/lib/_config.test.js';
import * as figma from '../../core/src/lib/figma.js';

import fs from 'fs';
import path from 'path';
import outputter from './index.js';

describe('outputter as svg', () => {
    beforeEach(() => {
        sinon.stub(fs, 'mkdirSync').returnsArg(0);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should export all components into svg files', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages = figma.getPagesWithComponents(document, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledTwice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'page1', 'Figma-Logo.svg'));
        expect(writeFileSync.secondCall).to.be.calledWithMatch(path.join('output', 'page1', 'Search.svg'));
    });

    it('should create folder if component names contain slashes', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const fakePages = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPagesWithComponents(fakePages, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'Figma-logo.svg'));
    });

    describe('options', () => {
        const fakePages = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPagesWithComponents(fakePages, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        it('should be able to customize "basename"', async () => {
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getBasename: (options) => `${options.pageName}-${options.basename}.svg`,
            })(pages);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'fakePage-Figma-logo.svg'));
        });

        it('should be able to customize "dirname"', async () => {
            const writeFileSync = sinon.stub(fs, 'writeFileSync');

            await outputter({
                output: 'output',
                getBasename: (options) => `${options.pageName}-${options.basename}.svg`,
                getDirname: (options) => `${options.dirname}`,
            })(pages);

            expect(writeFileSync).to.be.calledOnce;
            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'icon', 'fakePage-Figma-logo.svg'));
        });
    });
});
