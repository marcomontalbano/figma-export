import sinon from 'sinon';
import { expect } from 'chai';

import * as Figma from 'figma-js';

import * as FigmaExport from './figma';

import { styles as exportStyles } from './export-styles';

import fileJson from './_mocks_/figma.files.json';
import fileNodesJson from './_mocks_/figma.fileNodes.json';

const file = fileJson as Figma.FileResponse;
const fileNodes = fileNodesJson as Figma.FileNodesResponse;

const fileNodeIds = Object.keys(fileNodes.nodes);

describe('export-styles', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let logger: sinon.SinonSpy<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outputter: sinon.SinonSpy<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFileNodes: sinon.SinonStub<any[], any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientFile: sinon.SinonStub<any[], any>;

    let client: Figma.ClientInterface;

    beforeEach(() => {
        logger = sinon.spy();
        outputter = sinon.spy();

        clientFile = sinon.stub().resolves({ data: file });
        clientFileNodes = sinon.stub().resolves({ data: fileNodes });

        client = {
            ...({} as Figma.ClientInterface),
            file: clientFile,
            fileNodes: clientFileNodes,
        };

        sinon.stub(FigmaExport, 'getClient').returns(client);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should use outputter to export styles', async () => {
        const pagesWithSvg = await exportStyles({
            fileId: 'fileABCD',
            version: 'versionABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
        });

        expect(FigmaExport.getClient).to.have.been.calledOnceWithExactly('token1234');
        expect(clientFileNodes).to.have.been.calledOnceWith('fileABCD', { ids: fileNodeIds, version: 'versionABCD' });
        expect(clientFile.firstCall).to.have.been.calledWith('fileABCD', { version: 'versionABCD', depth: 1 });
        expect(clientFile.secondCall).to.have.been.calledWith('fileABCD', { version: 'versionABCD', ids: undefined });

        expect(logger).to.have.been.callCount(4);
        expect(logger.getCall(0)).to.have.been.calledWith('fetching document');
        expect(logger.getCall(1)).to.have.been.calledWith('fetching styles');
        expect(logger.getCall(2)).to.have.been.calledWith('parsing styles');
        expect(logger.getCall(3)).to.have.been.calledWith('exported styles from fileABCD');

        expect(outputter).to.have.been.calledOnceWithExactly(pagesWithSvg);
    });

    it('should use outputter to export styles', async () => {
        const pagesWithSvg = await exportStyles({
            fileId: 'fileABCD',
            version: 'versionABCD',
            onlyFromPages: ['octicons-by-github'],
            token: 'token1234',
            log: logger,
            outputters: [outputter],
        });

        expect(FigmaExport.getClient).to.have.been.calledOnceWithExactly('token1234');
        expect(clientFileNodes).to.have.been.calledOnceWith('fileABCD', { ids: fileNodeIds, version: 'versionABCD' });
        expect(clientFile.firstCall).to.have.been.calledWith('fileABCD', { version: 'versionABCD', depth: 1 });
        expect(clientFile.secondCall).to.have.been.calledWith('fileABCD', { version: 'versionABCD', ids: ['254:0'] });

        expect(logger).to.have.been.callCount(4);
        expect(logger.getCall(0)).to.have.been.calledWith('fetching document');
        expect(logger.getCall(1)).to.have.been.calledWith('fetching styles');
        expect(logger.getCall(2)).to.have.been.calledWith('parsing styles');
        expect(logger.getCall(3)).to.have.been.calledWith('exported styles from fileABCD');

        expect(outputter).to.have.been.calledOnceWithExactly(pagesWithSvg);
    });

    it('should use default "logger" if not defined', async () => {
        await exportStyles({
            fileId: 'fileABCD',
            token: 'token1234',
        });

        /* eslint-disable no-console */
        expect(console.log).to.have.been.callCount(4);
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(0)).to.have.been.calledWith('fetching document');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(1)).to.have.been.calledWith('fetching styles');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(2)).to.have.been.calledWith('parsing styles');
        expect((console.log as sinon.SinonSpy<unknown[], unknown>).getCall(3)).to.have.been.calledWith('exported styles from fileABCD');
    });

    it('should throw an error when fetching document fails', async () => {
        clientFile.onFirstCall().returns(Promise.reject(new Error('some error')));

        await expect(exportStyles({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, 'while fetching file "fileABCD": some error');
    });

    it('should throw an error when fetching styles fails', async () => {
        clientFile.onFirstCall().returns(Promise.resolve({ data: { document: file.document } }));
        clientFile.onSecondCall().returns(Promise.reject(new Error('some error')));

        await expect(exportStyles({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, 'while fetching file "fileABCD": some error');
    });

    it('should throw an error if pages are missing when fetching file', async () => {
        clientFile.returns(Promise.resolve({}));

        await expect(exportStyles({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, '\'document\' is missing.');
    });

    it('should throw an error if styles property is missing when fetching file', async () => {
        clientFile.returns(Promise.resolve({ data: { document: file.document } }));

        await expect(exportStyles({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, '\'styles\' are missing.');
    });

    it('should throw an error when fetching fileNodes fails', async () => {
        clientFileNodes.returns(Promise.reject(new Error('some error')));

        await expect(exportStyles({
            fileId: 'fileABCD',
            token: 'token1234',
        })).to.be.rejectedWith(Error, 'while fetching fileNodes: some error');
    });
});
