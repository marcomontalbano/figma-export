import { afterEach, describe, expect, it, vi } from 'vitest';

import type * as Figma from 'figma-js';

import fileNodesJson from './_mocks_/figma.fileNodes.json' assert {
  type: 'json',
};
import fileJson from './_mocks_/figma.files.json' assert { type: 'json' };

const file = fileJson as Figma.FileResponse;
const fileNodes = fileNodesJson as Figma.FileNodesResponse;

const fileNodeIds = Object.keys(fileNodes.nodes);

describe('export-styles', async () => {
  const logger = vi.fn();

  vi.stubGlobal('console', {
    log: vi.fn(),
  });

  const outputter = vi.fn();

  const client = {
    file: vi.fn().mockResolvedValue({ data: file }),
    fileNodes: vi.fn().mockResolvedValue({ data: fileNodes }),
  };

  vi.doMock('figma-js', () => {
    return {
      Client: vi.fn().mockReturnValue(client),
    };
  });

  const exportStyles = (await import('./export-styles.js')).styles;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should use outputter to export styles without defining the "onlyFromPages" option', async () => {
    const pagesWithSvg = await exportStyles({
      fileId: 'fileABCD',
      version: 'versionABCD',
      token: 'token1234',
      log: logger,
      outputters: [outputter],
    });

    expect(client.fileNodes).toHaveBeenCalledOnce();
    expect(client.fileNodes).toHaveBeenCalledWith('fileABCD', {
      ids: fileNodeIds,
      version: 'versionABCD',
    });
    expect(client.file).toHaveBeenCalledOnce;
    expect(client.file).toHaveBeenNthCalledWith(1, 'fileABCD', {
      version: 'versionABCD',
      depth: undefined,
      ids: undefined,
    });

    expect(logger).toHaveBeenCalledTimes(4);
    expect(logger).toHaveBeenNthCalledWith(1, 'fetching document');
    expect(logger).toHaveBeenNthCalledWith(2, 'fetching styles');
    expect(logger).toHaveBeenNthCalledWith(3, 'parsing styles');
    expect(logger).toHaveBeenNthCalledWith(4, 'exported styles from fileABCD');

    expect(outputter).toHaveBeenCalledWith(pagesWithSvg);
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

    expect(client.fileNodes).toHaveBeenCalledOnce();
    expect(client.fileNodes).toHaveBeenCalledWith('fileABCD', {
      ids: fileNodeIds,
      version: 'versionABCD',
    });
    expect(client.file).toHaveBeenCalledTimes(2);
    expect(client.file).toHaveBeenNthCalledWith(1, 'fileABCD', {
      version: 'versionABCD',
      depth: 1,
      ids: undefined,
    });
    expect(client.file).toHaveBeenNthCalledWith(2, 'fileABCD', {
      version: 'versionABCD',
      depth: undefined,
      ids: ['254:0'],
    });

    expect(logger).toHaveBeenCalledTimes(4);
    expect(logger).toHaveBeenNthCalledWith(1, 'fetching document');
    expect(logger).toHaveBeenNthCalledWith(2, 'fetching styles');
    expect(logger).toHaveBeenNthCalledWith(3, 'parsing styles');
    expect(logger).toHaveBeenNthCalledWith(4, 'exported styles from fileABCD');

    expect(outputter).toHaveBeenCalledWith(pagesWithSvg);
  });

  it('should use default "logger" if not defined', async () => {
    await exportStyles({
      fileId: 'fileABCD',
      token: 'token1234',
    });

    /* eslint-disable no-console */
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toHaveBeenNthCalledWith(1, 'fetching document');
    expect(console.log).toHaveBeenNthCalledWith(2, 'fetching styles');
    expect(console.log).toHaveBeenNthCalledWith(3, 'parsing styles');
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      'exported styles from fileABCD',
    );
  });

  it('should throw an error when fetching document fails', async () => {
    client.file.mockRejectedValueOnce(new Error('some error'));

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow('while fetching file "fileABCD": some error');
  });

  it('should throw an error when fetching styles fails', async () => {
    client.file.mockRejectedValueOnce(new Error('some error'));

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow('while fetching file "fileABCD": some error');
  });

  it('should throw an error if pages are missing when fetching file', async () => {
    client.file.mockResolvedValueOnce({});

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow("'styles' are missing.");
  });

  it('should throw an error if styles property is missing when fetching file', async () => {
    client.file.mockResolvedValueOnce({ data: { document: file.document } });

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow("'styles' are missing.");
  });

  it('should throw an error when fetching fileNodes fails', async () => {
    client.fileNodes.mockRejectedValueOnce(new Error('some error'));

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow('while fetching fileNodes: some error');
  });
});
