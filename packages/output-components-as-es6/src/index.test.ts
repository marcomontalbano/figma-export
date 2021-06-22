/* eslint-disable no-console */

import sinon from 'sinon';
import { expect } from 'chai';
import nock from 'nock';

import { camelCase } from '@figma-export/utils';

import * as FigmaExport from '@figma-export/types';

import * as figmaDocument from '../../core/src/lib/_config.test';
import * as figma from '../../core/src/lib/figma';

import fs = require('fs');
import outputter = require('./index');

describe('outputter as es6', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFileImages: sinon.SinonStub<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFile: sinon.SinonStub<any[], any>;

    let client;
    let nockScope: nock.Scope;

    beforeEach(() => {
        clientFileImages = sinon.stub().returns(Promise.resolve({
            data: {
                images: {
                    '10:8': 'https://example.com/10:8.svg',
                    '8:1': 'https://example.com/8:1.svg',
                    '9:1': 'https://example.com/9:1.svg',
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

        nockScope = nock('https://example.com', { reqheaders: { 'Content-Type': 'images/svg+xml' } })
            .get('/10:8.svg')
            .delay(1)
            .reply(200, figmaDocument.svg.content)
            .get('/8:1.svg')
            .delay(3)
            .reply(200, figmaDocument.svg.content)
            .get('/9:1.svg')
            .delay(2)
            .reply(200, figmaDocument.svg.content);
    });
    afterEach(() => {
        sinon.restore();
        nock.cleanAll();
    });

    it('should export all components into an es6 file', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages: FigmaExport.PageNode[] = figma.getPages(document);
        const pagesWithSvg = await figma.enrichPagesWithSvg(client, 'fileABCD', pages);

        nockScope.done();

        await outputter({
            output: 'output',
        })(pagesWithSvg);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1.js',

            // eslint-disable-next-line max-len
            'export const figmaLogo = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;',
        );
    });

    it('should use "variablePrefix" and "variableSuffix" options to prepend or append a text to the variable name', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages: FigmaExport.PageNode[] = figma.getPages(document);
        const pagesWithSvg = await figma.enrichPagesWithSvg(client, 'fileABCD', pages);

        nockScope.done();

        await outputter({
            output: 'output',
            getVariableName: (options) => camelCase(`i ${options.componentName} my ico`),
        })(pagesWithSvg);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1.js',

            // eslint-disable-next-line max-len
            'export const iFigmaLogoMyIco = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;',
        );
    });

    it('should export all components into an es6 file using base64 encoding if set', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages: FigmaExport.PageNode[] = figma.getPages(document);
        const pagesWithSvg = await figma.enrichPagesWithSvg(client, 'fileABCD', pages);

        nockScope.done();

        await outputter({
            output: 'output',
            useBase64: true,
        })(pagesWithSvg);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1.js',
            // eslint-disable-next-line max-len
            'export const figmaLogo = `PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA0MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=`;',
        );
    });

    it('should export all components into an es6 file using dataUrl if set', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages: FigmaExport.PageNode[] = figma.getPages(document);
        const pagesWithSvg = await figma.enrichPagesWithSvg(client, 'fileABCD', pages);

        nockScope.done();

        await outputter({
            output: 'output',
            useDataUrl: true,
        })(pagesWithSvg);

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

        const document = figmaDocument.createDocument({ children: [page] });
        const pages: FigmaExport.PageNode[] = figma.getPages(document);
        const spyOutputter = sinon.spy(outputter);

        return spyOutputter({
            output: 'output',
        })(pages).then(() => {
            sinon.assert.fail();
        }).catch((err) => {
            expect(err).to.be.an('Error');
            expect(err.message).to.be.equal('"1-icon" thrown an error: component names cannot start with a number.');
        });
    });

    it('should throw an error if two or more components have the same name', async () => {
        const page = {
            ...figmaDocument.page1,
            children: [figmaDocument.component1, figmaDocument.component1],
        };

        sinon.stub(fs, 'writeFileSync');

        const document = figmaDocument.createDocument({ children: [page] });
        const pages: FigmaExport.PageNode[] = figma.getPages(document);
        const spyOutputter = sinon.spy(outputter);

        return spyOutputter({
            output: 'output',
        })(pages).then(() => {
            sinon.assert.fail();
        }).catch((err) => {
            expect(err).to.be.an('Error');
            expect(err.message).to.be.equal('Component "Figma-Logo" has an error: two components cannot have a same name.');
        });
    });
});
