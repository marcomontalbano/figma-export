import {
    expect, describe, it, beforeEach, afterEach, vi,
} from 'vitest';
import nock from 'nock';

import * as figmaDocument from './_config.helper-test.js';

describe('export-component', async () => {
    const logger = vi.fn();
    const outputter = vi.fn();
    const transformer = vi.fn().mockImplementation((svg) => svg);

    vi.stubGlobal('console', {
        log: vi.fn(),
    });

    const client = {
        fileImages: vi.fn().mockResolvedValue({
            data: {
                images: {
                    '10:8': 'https://example.com/10:8.svg',
                    '8:1': 'https://example.com/8:1.svg',
                    '9:1': 'https://example.com/9:1.svg',
                },
            },
        }),
        file: vi.fn().mockResolvedValue({
            data: {
                document: figmaDocument.createDocument({ children: [figmaDocument.page1, figmaDocument.page2] }),
            },
        }),
    };

    vi.doMock('figma-js', () => {
        return {
            Client: vi.fn().mockReturnValue(client),
        };
    });

    let nockScope: nock.Scope;

    const exportComponents = (await import('./export-components.js')).components;

    beforeEach(async () => {
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
        vi.clearAllMocks();
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

        expect(client.fileImages).toHaveBeenCalledOnce();
        expect(client.fileImages).toHaveBeenCalledWith('fileABCD', {
            format: 'svg',
            ids: ['10:8', '8:1', '9:1'],
            svg_include_id: true,
            version: 'versionABCD',
        });

        expect(client.file).toHaveBeenCalledOnce();
        expect(client.file).toHaveBeenNthCalledWith(1, 'fileABCD', {
            version: 'versionABCD', depth: undefined, ids: undefined,
        });

        expect(logger).toHaveBeenCalledTimes(6);
        expect(logger).toHaveBeenNthCalledWith(1, 'fetching document');
        expect(logger).toHaveBeenNthCalledWith(2, 'preparing components');
        expect(logger).toHaveBeenNthCalledWith(3, 'fetching components 1/3');
        expect(logger).toHaveBeenNthCalledWith(4, 'fetching components 2/3');
        expect(logger).toHaveBeenNthCalledWith(5, 'fetching components 3/3');
        expect(logger).toHaveBeenNthCalledWith(6, 'exported components from fileABCD');

        expect(transformer).toHaveBeenCalledTimes(3);
        expect(transformer).toHaveBeenNthCalledWith(1, figmaDocument.svg.content);
        expect(transformer).toHaveBeenNthCalledWith(2, figmaDocument.svg.content);
        expect(transformer).toHaveBeenNthCalledWith(3, figmaDocument.svg.content);

        expect(outputter).toHaveBeenCalledOnce();
        expect(outputter).toHaveBeenCalledWith(pagesWithSvg);
    });

    it('should filter by selected page names when setting onlyFromPages', async () => {
        const pagesWithSvg = await exportComponents({
            fileId: 'fileABCD',
            version: 'versionABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
            transformers: [transformer],
            onlyFromPages: ['page2'],
        });

        nockScope.done();

        expect(client.fileImages).toHaveBeenCalledWith('fileABCD', {
            format: 'svg',
            ids: ['10:8', '8:1', '9:1'],
            svg_include_id: true,
            version: 'versionABCD',
        });

        expect(client.file).toHaveBeenCalledTimes(2);
        expect(client.file).toHaveBeenNthCalledWith(1, 'fileABCD', { version: 'versionABCD', depth: 1, ids: undefined });
        expect(client.file).toHaveBeenNthCalledWith(2, 'fileABCD', {
            version: 'versionABCD', depth: undefined, ids: ['10:7'],
        });

        expect(logger).toHaveBeenCalledTimes(6);
        expect(logger).toHaveBeenNthCalledWith(1, 'fetching document');
        expect(logger).toHaveBeenNthCalledWith(2, 'preparing components');
        expect(logger).toHaveBeenNthCalledWith(3, 'fetching components 1/3');
        expect(logger).toHaveBeenNthCalledWith(4, 'fetching components 2/3');
        expect(logger).toHaveBeenNthCalledWith(5, 'fetching components 3/3');
        expect(logger).toHaveBeenNthCalledWith(6, 'exported components from fileABCD');

        expect(transformer).toHaveBeenCalledTimes(3);
        expect(transformer).toHaveBeenNthCalledWith(1, figmaDocument.svg.content);
        expect(transformer).toHaveBeenNthCalledWith(2, figmaDocument.svg.content);
        expect(transformer).toHaveBeenNthCalledWith(3, figmaDocument.svg.content);

        expect(outputter).toHaveBeenCalledOnce();
        expect(outputter).toHaveBeenCalledWith(pagesWithSvg);
    });

    it('should filter by selected page IDs when setting onlyFromPages', async () => {
        const pagesWithSvg = await exportComponents({
            fileId: 'fileABCD',
            version: 'versionABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
            transformers: [transformer],
            onlyFromPages: ['10:7'],
        });

        nockScope.done();

        expect(client.fileImages).toHaveBeenCalledWith('fileABCD', {
            format: 'svg',
            ids: ['10:8', '8:1', '9:1'],
            svg_include_id: true,
            version: 'versionABCD',
        });

        expect(client.file).toHaveBeenCalledTimes(2);
        expect(client.file).toHaveBeenNthCalledWith(1, 'fileABCD', { version: 'versionABCD', depth: 1, ids: undefined });
        expect(client.file).toHaveBeenNthCalledWith(2, 'fileABCD', {
            version: 'versionABCD', depth: undefined, ids: ['10:7'],
        });

        expect(logger).toHaveBeenCalledTimes(6);
        expect(logger).toHaveBeenNthCalledWith(1, 'fetching document');
        expect(logger).toHaveBeenNthCalledWith(2, 'preparing components');
        expect(logger).toHaveBeenNthCalledWith(3, 'fetching components 1/3');
        expect(logger).toHaveBeenNthCalledWith(4, 'fetching components 2/3');
        expect(logger).toHaveBeenNthCalledWith(5, 'fetching components 3/3');
        expect(logger).toHaveBeenNthCalledWith(6, 'exported components from fileABCD');

        expect(transformer).toHaveBeenCalledTimes(3);
        expect(transformer).toHaveBeenNthCalledWith(1, figmaDocument.svg.content);
        expect(transformer).toHaveBeenNthCalledWith(2, figmaDocument.svg.content);
        expect(transformer).toHaveBeenNthCalledWith(3, figmaDocument.svg.content);

        expect(outputter).toHaveBeenCalledOnce();
        expect(outputter).toHaveBeenCalledWith(pagesWithSvg);
    });

    it('should filter by selected IDs when setting "ids" argument', async () => {
        await exportComponents({
            fileId: 'fileABCD',
            version: 'versionABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
            transformers: [transformer],
            ids: ['9:1'],
        });

        nockScope.done();

        expect(client.file).toHaveBeenCalledOnce();
        expect(client.file).toHaveBeenNthCalledWith(1, 'fileABCD', {
            version: 'versionABCD', depth: undefined, ids: ['9:1'],
        });
    });

    it('should throw an error when onlyFromPages is set to a page not found', async () => {
        // eslint-disable-next-line no-return-await
        await expect(exportComponents({
            fileId: 'fileABCD',
            version: 'versionABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
            transformers: [transformer],
            onlyFromPages: ['nonexistingNameOrId'],
        })).rejects.toThrow('Cannot find any page with "onlyForPages" equal to ["nonexistingNameOrId"]');
    });

    it('should use default "logger" if not defined', async () => {
        await exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        });

        /* eslint-disable no-console */
        expect(console.log).toHaveBeenCalledTimes(6);
        expect(console.log).toHaveBeenNthCalledWith(1, 'fetching document');
        expect(console.log).toHaveBeenNthCalledWith(2, 'preparing components');
        expect(console.log).toHaveBeenNthCalledWith(3, 'fetching components 1/3');
        expect(console.log).toHaveBeenNthCalledWith(4, 'fetching components 2/3');
        expect(console.log).toHaveBeenNthCalledWith(5, 'fetching components 3/3');
        expect(console.log).toHaveBeenNthCalledWith(6, 'exported components from fileABCD');
    });

    it('should use filter before fetch components', async () => {
        client.fileImages.mockResolvedValueOnce({
            data: {
                images: {
                    '10:8': 'https://example.com/10:8.svg',
                },
            },
        });

        const pagesWithSvg = await exportComponents({
            fileId: 'fileABCD',
            version: 'versionABCD',
            token: 'token1234',
            log: logger,
            outputters: [outputter],
            transformers: [transformer],
            filterComponent: (component) => component.name === figmaDocument.component1.name,
        });

        expect(client.fileImages).toHaveBeenCalledWith('fileABCD', {
            format: 'svg',
            ids: ['10:8'],
            svg_include_id: true,
            version: 'versionABCD',
        });

        expect(client.file).toHaveBeenCalledOnce();
        expect(client.file).toHaveBeenNthCalledWith(
            1,
            'fileABCD',
            { version: 'versionABCD', depth: undefined, ids: undefined },
        );

        expect(logger).toHaveBeenCalledTimes(4);
        expect(logger).toHaveBeenNthCalledWith(1, 'fetching document');
        expect(logger).toHaveBeenNthCalledWith(2, 'preparing components');
        expect(logger).toHaveBeenNthCalledWith(3, 'fetching components 1/1');
        expect(logger).toHaveBeenNthCalledWith(4, 'exported components from fileABCD');

        expect(transformer).toHaveBeenCalledOnce();
        expect(transformer).toHaveBeenNthCalledWith(1, figmaDocument.svg.content);

        expect(outputter).toHaveBeenCalledOnce();
        expect(outputter).toHaveBeenCalledWith(pagesWithSvg);
    });

    it('should throw an error when fetching file fails', async () => {
        client.file.mockRejectedValueOnce(new Error('some error'));

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).rejects.toThrow('while fetching file "fileABCD": some error');
    });

    it('should throw an error if document property is missing when fetching file', async () => {
        client.file.mockResolvedValueOnce({});

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).rejects.toThrow('\'document\' is missing.');
    });

    it('should throw an error when fetching a document without components', async () => {
        client.file.mockResolvedValueOnce({
            data: {
                document: figmaDocument.createDocument({ children: [figmaDocument.pageWithoutComponents] }),
            },
        });

        await expect(exportComponents({
            fileId: 'fileABCD',
            token: 'token1234',
        })).rejects.toThrow('No components found');
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
            retries: 0,
        })).rejects.toThrow('while fetching svg "https://example.com/10:8.svg": some error');
    });
});
