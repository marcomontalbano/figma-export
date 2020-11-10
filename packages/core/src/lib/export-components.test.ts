import sinon from 'sinon';
import { expect } from 'chai';
import nock from 'nock';

import * as Figma from 'figma-js';

import * as figmaDocument from './_config.test';
import * as FigmaExport from './figma';

import { components as exportComponents } from './export-components';

describe('export-component', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let logger: sinon.SinonSpy<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outputter: sinon.SinonSpy<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let transformer: sinon.SinonSpy<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFileImages: sinon.SinonStub<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFile: sinon.SinonStub<any[], any>;

    let client: Figma.ClientInterface;
    let nockScope: nock.Scope;

    beforeEach(() => {
        logger = sinon.spy();
        outputter = sinon.spy();
        transformer = sinon.spy((svg) => svg);

        clientFileImages = sinon.stub().returns(Promise.resolve({
            data: {
                images: {
                    A1: 'https://example.com/A1.svg',
                    B2: 'https://example.com/B2.svg',
                },
            },
        }));

        clientFile = sinon.stub().resolves({
            data: {
                document: figmaDocument.createDocument({ children: [figmaDocument.page1, figmaDocument.page2] }),
            },
        });

        client = {
            ...({} as Figma.ClientInterface),
            fileImages: clientFileImages,
            file: clientFile,
        };

        nockScope = nock('https://example.com', { reqheaders: { 'Content-Type': 'images/svg+xml' } })
            .get('/A1.svg')
            .reply(200, figmaDocument.svg.content)
            .get('/B2.svg')
            .reply(200, figmaDocument.svg.content);

        sinon.stub(FigmaExport, 'getClient').returns(client);
    });

    afterEach(() => {
        sinon.restore();
        nock.cleanAll();
    });

    it('should use transformers and outputter to export components', async () => {
        const pagesWithSvg = await exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
            transformers: [transformer],
        });

        nockScope.done();

        expect(FigmaExport.getClient).to.have.been.calledOnceWithExactly('token1234');
        expect(clientFileImages).to.have.been.calledOnceWith('fileABCD', {
            format: 'svg',
            ids: ['10:8', '8:1', '9:1'],
            svg_include_id: true,
        });
        expect(clientFile).to.have.been.calledOnceWithExactly('fileABCD');

        expect(logger).to.have.been.calledTwice;
        expect(logger.firstCall).to.have.been.calledWith('fetching document');
        expect(logger.secondCall).to.have.been.calledWith('fetching components');

        expect(transformer).to.have.been.calledTwice;
        expect(transformer.firstCall).to.have.been.calledWith(figmaDocument.svg.content);
        expect(transformer.secondCall).to.have.been.calledWith(figmaDocument.svg.content);

        expect(outputter).to.have.been.calledOnceWithExactly(pagesWithSvg);
    });

    it('should use default "logger" if not defined', async () => {
        await exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        });

        /* eslint-disable no-console */
        expect(console.log).to.have.been.calledTwice;
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).firstCall).to.have.been.calledWith('fetching document');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).secondCall).to.have.been.calledWith('fetching components');
    });

    it('should throw an error when fetching file fails', async () => {
        clientFile.returns(Promise.reject(new Error('some error')));

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, 'while fetching file "fileABCD": some error');
    });

    it('should throw an error if document property is missing when fetching file', async () => {
        clientFile.returns(Promise.resolve({}));

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, '\'document\' is missing.');
    });

    it('should throw an error when fetching a document without components', async () => {
        clientFile.resolves({
            data: {
                document: figmaDocument.createDocument({ children: [figmaDocument.pageWithoutComponents] }),
            },
        });

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, 'No components found');
    });

    it('should throw an error when fetching svg fails', async () => {
        nock.cleanAll();
        nock('https://example.com', { reqheaders: { 'Content-Type': 'images/svg+xml' } })
            .get('/A1.svg')
            .replyWithError({ code: 'ECONNRESET', message: 'some error' })
            .get('/B2.svg')
            .replyWithError({ code: 'ECONNRESET', message: 'some error' });

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, 'while fetching svg "https://example.com/A1.svg": some error');
    });
});
