/* eslint-disable no-console */

import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { camelCase } from '@figma-export/utils';

import type * as FigmaExport from '@figma-export/types';

import * as figmaDocument from '../../core/src/lib/_config.helper-test.js';
import type { ClientInterface } from '../../core/src/lib/client.js';
import * as figma from '../../core/src/lib/figma.js';

import fs from 'node:fs';
import path from 'node:path';
import outputter from './index.js';

vi.mock('fs');

const getComponentsDefaultOptions: Parameters<typeof figma.getComponents>[2] = {
  filterComponent: () => true,
  includeTypes: ['COMPONENT'],
};

describe('outputter as es6', () => {
  let client: ClientInterface;
  let nockScope: nock.Scope;

  beforeEach(() => {
    client = {
      hasError: vi.fn().mockReturnValue(false),
      getImages: vi.fn().mockResolvedValue({
        images: {
          '10:8': 'https://example.com/10:8.svg',
          '8:1': 'https://example.com/8:1.svg',
          '9:1': 'https://example.com/9:1.svg',
        },
      }),
      getFile: vi.fn().mockResolvedValue({
        document: figmaDocument.createDocument({
          children: [figmaDocument.page1, figmaDocument.page2],
        }),
      }),
    } as unknown as ClientInterface;

    nockScope = nock('https://example.com', {
      reqheaders: { 'Content-Type': 'images/svg+xml' },
    })
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
    vi.resetAllMocks();
    nock.cleanAll();
  });

  it('should export all components into an es6 file', async () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1],
    });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );
    const pagesWithSvg = await figma.enrichPagesWithSvg(
      client,
      'fileABCD',
      pages,
    );

    nockScope.done();

    await outputter({
      output: 'output',
    })(pagesWithSvg);

    expect(fs.writeFileSync).toHaveBeenCalledOnce;
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve('output', 'page1.js'),

      // eslint-disable-next-line max-len
      'export const figmaLogo = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;\n' +
        'export const search = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;\n',
    );
  });

  it('should use "variablePrefix" and "variableSuffix" options to prepend or append a text to the variable name', async () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1],
    });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );
    const pagesWithSvg = await figma.enrichPagesWithSvg(
      client,
      'fileABCD',
      pages,
    );

    nockScope.done();

    await outputter({
      output: 'output',
      getVariableName: (options) =>
        camelCase(`i ${options.componentName} my ico`),
    })(pagesWithSvg);

    expect(fs.writeFileSync).toHaveBeenCalledOnce;
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve('output', 'page1.js'),

      // eslint-disable-next-line max-len
      'export const iFigmaLogoMyIco = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;\n' +
        'export const iSearchMyIco = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;\n',
    );
  });

  it('should export all components into an es6 file using base64 encoding if set', async () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1],
    });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );
    const pagesWithSvg = await figma.enrichPagesWithSvg(
      client,
      'fileABCD',
      pages,
    );

    nockScope.done();

    await outputter({
      output: 'output',
      useBase64: true,
    })(pagesWithSvg);

    expect(fs.writeFileSync).toHaveBeenCalledOnce;
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve('output', 'page1.js'),

      // eslint-disable-next-line max-len
      'export const figmaLogo = `PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA0MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=`;\n' +
        // eslint-disable-next-line max-len
        'export const search = `PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA0MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=`;\n',
    );
  });

  it('should export all components into an es6 file using dataUrl if set', async () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1],
    });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );
    const pagesWithSvg = await figma.enrichPagesWithSvg(
      client,
      'fileABCD',
      pages,
    );

    nockScope.done();

    await outputter({
      output: 'output',
      useDataUrl: true,
    })(pagesWithSvg);

    expect(fs.writeFileSync).toHaveBeenCalledOnce;
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve('output', 'page1.js'),

      // eslint-disable-next-line max-len
      "export const figmaLogo = `data:image/svg+xml,%3csvg width='40' height='60' viewBox='0 0 40 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3c/svg%3e`;\n" +
        // eslint-disable-next-line max-len
        "export const search = `data:image/svg+xml,%3csvg width='40' height='60' viewBox='0 0 40 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3c/svg%3e`;\n",
    );

    expect(fs.mkdirSync).toHaveBeenCalledOnce;
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.resolve('output'), {
      recursive: true,
    });
  });

  it('should not break when transformers return "undefined"', async () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1],
    });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );
    const pagesWithSvg = await figma.enrichPagesWithSvg(
      client,
      'fileABCD',
      pages,
      undefined,
      {
        transformers: [async () => undefined],
      },
    );

    nockScope.done();

    await outputter({
      output: 'output',
    })(pagesWithSvg);

    expect(fs.writeFileSync).toHaveBeenCalledOnce;
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve('output', 'page1.js'),

      // eslint-disable-next-line max-len
      'export const figmaLogo = `<svg></svg>`;\n' +
        'export const search = `<svg></svg>`;\n',
    );
  });

  it('should throw an error if component starts with a number', async () => {
    const page = {
      ...figmaDocument.page1,
      children: [figmaDocument.componentWithNumber],
    };

    const document = figmaDocument.createDocument({ children: [page] });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );

    await expect(() =>
      outputter({
        output: 'output',
      })(pages),
    ).rejects.toThrow(
      '"1-icon" thrown an error: component names cannot start with a number.',
    );
  });

  it('should throw an error if two or more components have the same name', async () => {
    const page = {
      ...figmaDocument.page1,
      children: [figmaDocument.component1, figmaDocument.component1],
    };

    const document = figmaDocument.createDocument({ children: [page] });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );

    await expect(() =>
      outputter({
        output: 'output',
      })(pages),
    ).rejects.toThrow(
      'Component "Figma-Logo" has an error: two components cannot have a same name.',
    );
  });

  it('should create folders and subfolders when pageName contains slashes', async () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1WithSlashes],
    });
    const pages: FigmaExport.PageNode[] = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      getComponentsDefaultOptions,
    );
    const pagesWithSvg = await figma.enrichPagesWithSvg(
      client,
      'fileABCD',
      pages,
    );

    nockScope.done();

    await outputter({
      output: 'output',
    })(pagesWithSvg);

    expect(fs.writeFileSync).toHaveBeenCalledOnce;
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve('output', 'page1', 'subpath', 'subsubpath.js'),

      // eslint-disable-next-line max-len
      'export const figmaLogo = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;\n' +
        'export const search = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`;\n',
    );

    expect(fs.mkdirSync).toHaveBeenCalledOnce;
    expect(fs.mkdirSync).toHaveBeenCalledWith(
      path.resolve('output', 'page1', 'subpath'),
      { recursive: true },
    );
  });
});
