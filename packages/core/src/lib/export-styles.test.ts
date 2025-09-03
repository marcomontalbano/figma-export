import type * as Figma from '@figma/rest-api-spec';
import { afterEach, describe, expect, it, vi } from 'vitest';

import fileNodesJson from './_mocks_/figma.fileNodes.json' with {
  type: 'json',
};
import fileJson from './_mocks_/figma.files.json' with { type: 'json' };

const file = fileJson as Figma.GetFileResponse;
const fileNodes = fileNodesJson as Figma.GetFileNodesResponse;

const fileNodeIds = Object.keys(fileNodes.nodes);

describe('export-styles', async () => {
  const logger = vi.fn();

  vi.stubGlobal('console', {
    log: vi.fn(),
  });

  const outputter = vi.fn();

  const client = {
    hasError: vi.fn().mockReturnValue(false),
    getFile: vi.fn().mockResolvedValue({ ...file }),
    getFileNodes: vi.fn().mockResolvedValue({ ...fileNodes }),
  };

  vi.doMock('./client.js', () => {
    return {
      createClient: vi.fn().mockReturnValue(client),
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

    expect(client.getFileNodes).toHaveBeenCalledOnce();
    expect(client.getFileNodes).toHaveBeenCalledWith(
      { file_key: 'fileABCD' },
      {
        ids: fileNodeIds.join(','),
        version: 'versionABCD',
      },
    );
    expect(client.getFile).toHaveBeenCalledOnce;
    expect(client.getFile).toHaveBeenNthCalledWith(
      1,
      { file_key: 'fileABCD' },
      {
        version: 'versionABCD',
        depth: undefined,
        ids: undefined,
      },
    );

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

    expect(client.getFileNodes).toHaveBeenCalledOnce();
    expect(client.getFileNodes).toHaveBeenCalledWith(
      { file_key: 'fileABCD' },
      {
        ids: fileNodeIds.join(','),
        version: 'versionABCD',
      },
    );
    expect(client.getFile).toHaveBeenCalledTimes(2);
    expect(client.getFile).toHaveBeenNthCalledWith(
      1,
      { file_key: 'fileABCD' },
      {
        version: 'versionABCD',
        depth: 1,
        ids: undefined,
      },
    );
    expect(client.getFile).toHaveBeenNthCalledWith(
      2,
      { file_key: 'fileABCD' },
      {
        version: 'versionABCD',
        depth: undefined,
        ids: '254:0',
      },
    );

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
    client.getFile.mockRejectedValueOnce(new Error('some error'));

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow('while fetching file "fileABCD": some error');
  });

  it('should throw an error when fetching styles fails', async () => {
    client.getFile.mockRejectedValueOnce(new Error('some error'));

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow('while fetching file "fileABCD": some error');
  });

  it('should throw an error if pages are missing when fetching file', async () => {
    client.hasError.mockResolvedValueOnce(true);

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow("'styles' are missing.");
  });

  it('should throw an error when fetching fileNodes fails', async () => {
    client.getFileNodes.mockRejectedValueOnce(new Error('some error'));

    await expect(
      exportStyles({
        fileId: 'fileABCD',
        token: 'token1234',
      }),
    ).rejects.toThrow('while fetching fileNodes: some error');
  });
});
