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
            ...({} as Figma.ClientInterface),
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

        sinon.stub(FigmaExport, 'getClient').returns(client);
    });

    afterEach(() => {
        sinon.restore();
        nock.cleanAll();
    });

    it('should use transformers and outputter to export components', async () => {
        const pagesWithSvg = await exportComponents({
            fileId: 'fileABCD',
            version: 'versionABCD',
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
        expect(clientFile).to.have.been.calledOnceWithExactly('fileABCD', { version: 'versionABCD' });

        expect(logger).to.have.been.callCount(6);
        expect(logger.getCall(0)).to.have.been.calledWith('fetching document');
        expect(logger.getCall(1)).to.have.been.calledWith('preparing components');
        expect(logger.getCall(2)).to.have.been.calledWith('fetching components 1/3');
        expect(logger.getCall(3)).to.have.been.calledWith('fetching components 2/3');
        expect(logger.getCall(4)).to.have.been.calledWith('fetching components 3/3');
        expect(logger.getCall(5)).to.have.been.calledWith('exported components from fileABCD');

        expect(transformer).to.have.been.calledThrice;
        expect(transformer.firstCall).to.have.been.calledWith(figmaDocument.svg.content);
        expect(transformer.secondCall).to.have.been.calledWith(figmaDocument.svg.content);
        expect(transformer.thirdCall).to.have.been.calledWith(figmaDocument.svg.content);

        expect(outputter).to.have.been.calledOnceWithExactly(pagesWithSvg);
    });

    it('should use default "logger" if not defined', async () => {
        await exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        });

        /* eslint-disable no-console */
        expect(console.log).to.have.been.callCount(6);
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(0)).to.have.been.calledWith('fetching document');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(1)).to.have.been.calledWith('preparing components');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(2)).to.have.been.calledWith('fetching components 1/3');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(3)).to.have.been.calledWith('fetching components 2/3');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(4)).to.have.been.calledWith('fetching components 3/3');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(5)).to.have.been.calledWith('exported components from fileABCD');
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
            .get('/10:8.svg')
            .replyWithError({ code: 'ECONNRESET', message: 'some error' })
            .get('/8:1.svg')
            .replyWithError({ code: 'ECONNRESET', message: 'some error' })
            .get('/9:1.svg')
            .replyWithError({ code: 'ECONNRESET', message: 'some error' });

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, 'while fetching svg "https://example.com/10:8.svg": some error');
    });
});
