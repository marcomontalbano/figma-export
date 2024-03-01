import * as sinon from 'sinon';
import { expect } from 'chai';
import * as td from 'testdouble';

import * as Figma from 'figma-js';

import fileJson from './_mocks_/figma.files.json' assert { type: 'json' };
import fileNodesJson from './_mocks_/figma.fileNodes.json' assert { type: 'json' };

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

    let exportStyles: typeof import('./export-styles.js').styles;

    beforeEach(async () => {
        logger = sinon.spy();
        outputter = sinon.spy();

        clientFile = sinon.stub().resolves({ data: file });
        clientFileNodes = sinon.stub().resolves({ data: fileNodes });

        client = {
            ...({} as Figma.ClientInterface),
            file: clientFile,
            fileNodes: clientFileNodes,
        };

        const FigmaJS = await td.replaceEsm('figma-js');
        td.when(FigmaJS.Client({ personalAccessToken: 'token1234' })).thenReturn(client);

        exportStyles = (await import('./export-styles.js')).styles;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should use outputter to export styles without defining the "onlyFromPages" option', async () => {
        const pagesWithSvg = await exportStyles({
            fileId: 'fileABCD',
            version: 'versionABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
        });

        expect(clientFileNodes).to.have.been.calledOnceWith('fileABCD', { ids: fileNodeIds, version: 'versionABCD' });
        expect(clientFile).to.have.been.calledOnce;
        expect(clientFile.firstCall).to.have.been.calledWith('fileABCD', { version: 'versionABCD', depth: undefined, ids: undefined });

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
            onlyFromPages: ['icons/octicons-by-github'],
            token: 'token1234',
            log: logger,
            outputters: [outputter],
        });

        expect(clientFileNodes).to.have.been.calledOnceWith('fileABCD', { ids: fileNodeIds, version: 'versionABCD' });
        expect(clientFile).to.have.been.calledTwice;
        expect(clientFile.firstCall).to.have.been.calledWith('fileABCD', { version: 'versionABCD', depth: 1, ids: undefined });
        expect(clientFile.secondCall).to.have.been.calledWith('fileABCD', { version: 'versionABCD', depth: undefined, ids: ['254:0'] });

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
        clientFile.onFirstCall().returns(Promise.reject(new Error('some error')));

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
        })).to.be.rejectedWith(Error, '\'styles\' are missing.');
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
