import sinon from 'sinon';
import { expect } from 'chai';
import * as svgr from '@svgr/core';
import nock from 'nock';
import { camelCase, kebabCase } from '@figma-export/utils';
import * as figmaDocument from '../../core/src/lib/_config.test';
import * as figma from '../../core/src/lib/figma';

import fs from 'fs';
import path from 'path';
import outputter from './index';

describe('outputter as svgr', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFileImages: sinon.SinonStub<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFile: sinon.SinonStub<any[], any>;

    let client;

    let writeFileSync;
    let svgrAsync;

    beforeEach(() => {
        sinon.stub(fs, 'mkdirSync').returnsArg(0);
        writeFileSync = sinon.stub(fs, 'writeFileSync');
        svgrAsync = sinon.stub(svgr.transform, 'sync').returns('# code for react component #');

        clientFileImages = sinon.stub().returns(Promise.resolve({
            data: {
                images: {
                    '9:10': 'https://example.com/9:10.svg',
                },
            },
        }));

        clientFile = sinon.stub().resolves({
            data: {
                document: figmaDocument.createDocument({ children: [figmaDocument.page1, figmaDocument.page2] }),
            },
        });

        client = {
            fileImages: clientFileImages,
            file: clientFile,
        };

        nock('https://example.com', { reqheaders: { 'Content-Type': 'images/svg+xml' } })
            .get('/9:10.svg').delay(2).reply(200, figmaDocument.svg.content);
    });

    afterEach(() => {
        sinon.restore();
        nock.cleanAll();
    });

    it('should export all components into jsx files plus one index.js for each folder', async () => {
        const fakePage = figmaDocument.createPage([figmaDocument.component1, figmaDocument.component2]);
        const pages = figma.getPagesWithComponents(fakePage, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledThrice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'FigmaLogo.jsx'));
        expect(writeFileSync.secondCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'Search.jsx'));
        expect(writeFileSync.thirdCall).to.be.calledWithMatch(
            path.join('output', 'fakePage', 'index.js'),
            'export { default as FigmaLogo } from \'./FigmaLogo.jsx\';',
        );
    });

    it('should export all components into tsx files plus one index.ts for each folder', async () => {
        const fakePage = figmaDocument.createPage([figmaDocument.component1, figmaDocument.component2]);
        const pages = figma.getPagesWithComponents(fakePage, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
            getFileExtension: () => '.tsx',
        })(pages);

        expect(writeFileSync).to.be.calledThrice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'FigmaLogo.tsx'));
        expect(writeFileSync.secondCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'Search.tsx'));
        expect(writeFileSync.thirdCall).to.be.calledWithMatch(
            path.join('output', 'fakePage', 'index.ts'),
            'export { default as FigmaLogo } from \'./FigmaLogo.tsx\';',
        );
    });

    it('should create a custom export for every component using the template passed', async () => {
        const fakePage = figmaDocument.createPage([figmaDocument.component2]);
        const pages = figma.getPagesWithComponents(fakePage, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
            getExportTemplate: (options) => `export { ${options.basename} } from './customPath';`,
        })(pages);

        expect(writeFileSync).to.be.calledTwice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'Search.jsx'));
        expect(writeFileSync.secondCall).to.be.calledWithMatch(
            path.join('output', 'fakePage', 'index.js'),
            'export { Search } from \'./customPath\';',
        );
    });

    it('should create folder if component names contain slashes', async () => {
        const fakePage = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPagesWithComponents(fakePage, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledTwice;
        expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'FigmaLogo.jsx'));
        expect(writeFileSync.secondCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'index.js'));
    });

    describe('options', () => {
        const fakePage = figmaDocument.createPage([figmaDocument.componentWithSlashedName]);
        const pages = figma.getPagesWithComponents(fakePage, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        it('should be able to customize "dirname"', async () => {
            await outputter({
                output: 'output',
                getDirname: (options) => `${options.dirname}`,
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'icon', 'FigmaLogo.jsx'));
            expect(writeFileSync.secondCall).to.be.calledWithMatch(
                path.join('output', 'icon', 'index.js'),
                "export { default as FigmaLogo } from './FigmaLogo.jsx';",
            );
        });

        it('should be able to customize "componentName" (also "componentFilename" will be updated if not set)', async () => {
            await outputter({
                output: 'output',
                getComponentName: (options) => options.basename.toUpperCase(),
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'FIGMA-LOGO.jsx'));
            expect(writeFileSync.secondCall).to.be.calledWithMatch(
                path.join('output', 'fakePage', 'icon', 'index.js'),
                "export { default as FIGMA-LOGO } from './FIGMA-LOGO.jsx';",
            );
        });

        it('should be able to customize "componentFilename"', async () => {
            await outputter({
                output: 'output',
                getComponentFilename: (options) => kebabCase(options.basename).toLowerCase(),
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'figma-logo.jsx'));
            expect(writeFileSync.secondCall).to.be.calledWithMatch(
                path.join('output', 'fakePage', 'icon', 'index.js'),
                "export { default as FigmaLogo } from './figma-logo.jsx';",
            );
        });

        it('should be able to customize both "componentName" and "componentFilename"', async () => {
            await outputter({
                output: 'output',
                getComponentName: (options) => options.basename.toUpperCase(),
                getComponentFilename: (options) => camelCase(options.basename),
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'figmaLogo.jsx'));
            expect(writeFileSync.secondCall).to.be.calledWithMatch(
                path.join('output', 'fakePage', 'icon', 'index.js'),
                "export { default as FIGMA-LOGO } from './figmaLogo.jsx';",
            );
        });

        it('should be able to customize "fileExtension"', async () => {
            await outputter({
                output: 'output',
                getFileExtension: () => '.js',
            })(pages);

            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'FigmaLogo.js'));
            expect(writeFileSync.secondCall).to.be.calledWithMatch(
                path.join('output', 'fakePage', 'icon', 'index.js'),
                "from './FigmaLogo.js';",
            );
        });

        it('should be able to customize "svgrConfig"', async () => {
            const pagesWithSvg = await figma.enrichPagesWithSvg(client, 'fileABCD', pages);

            await outputter({
                output: 'output',
                getSvgrConfig: () => ({ native: true }),
            })(pagesWithSvg);

            expect(writeFileSync.firstCall).to.be.calledWithMatch(path.join('output', 'fakePage', 'icon', 'FigmaLogo.jsx'));
            expect(svgrAsync.firstCall).to.be.calledWithMatch(figmaDocument.componentWithSlashedNameOutput.svg, { native: true });
        });
    });
});
