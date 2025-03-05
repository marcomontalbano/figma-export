import { camelCase, kebabCase, pascalCase } from '@figma-export/utils';
import * as svgr from '@svgr/core';
import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as figmaDocument from '../../core/src/lib/_config.helper-test.js';
import * as figma from '../../core/src/lib/figma.js';

import fs from 'node:fs';
import path from 'node:path';
import type { ClientInterface } from 'figma-js';
import outputter from './index.js';

vi.mock('fs');
vi.mock('@svgr/core');

describe('outputter as svgr', () => {
  let client: ClientInterface;

  beforeEach(() => {
    client = {
      fileImages: vi.fn().mockResolvedValue({
        data: {
          images: {
            '9:10': 'https://example.com/9:10.svg',
          },
        },
      }),
      file: vi.fn().mockResolvedValue({
        data: {
          document: figmaDocument.createDocument({
            children: [figmaDocument.page1, figmaDocument.page2],
          }),
        },
      }),
    } as unknown as ClientInterface;

    nock('https://example.com', {
      reqheaders: { 'Content-Type': 'images/svg+xml' },
    })
      .get('/9:10.svg')
      .delay(2)
      .reply(200, figmaDocument.svg.content);
  });

  afterEach(() => {
    vi.resetAllMocks();
    nock.cleanAll();
  });

  it('should export all components into jsx files plus one index.js for each folder', async () => {
    const fakePage = figmaDocument.createPage([
      figmaDocument.component1,
      figmaDocument.component2,
    ]);
    const pages = figma.getPagesWithComponents(fakePage, {
      filterComponent: () => true,
      includeTypes: ['COMPONENT'],
    });

    await outputter({
      output: 'output',
    })(pages);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(3);
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      path.resolve('output', 'fakePage', 'FigmaLogo.jsx'),
      undefined,
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      path.resolve('output', 'fakePage', 'Search.jsx'),
      undefined,
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      3,
      path.resolve('output', 'fakePage', 'index.js'),

      "export { default as FigmaLogo } from './FigmaLogo.jsx';\n" +
        "export { default as Search } from './Search.jsx';",
    );
  });

  it('should export all components into tsx files plus one index.ts for each folder', async () => {
    const fakePage = figmaDocument.createPage([
      figmaDocument.component1,
      figmaDocument.component2,
    ]);
    const pages = figma.getPagesWithComponents(fakePage, {
      filterComponent: () => true,
      includeTypes: ['COMPONENT'],
    });

    await outputter({
      output: 'output',
      getFileExtension: () => '.tsx',
    })(pages);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(3);
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      path.resolve('output', 'fakePage', 'FigmaLogo.tsx'),
      undefined,
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      path.resolve('output', 'fakePage', 'Search.tsx'),
      undefined,
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      3,
      path.resolve('output', 'fakePage', 'index.ts'),

      "export { default as FigmaLogo } from './FigmaLogo.tsx';\n" +
        "export { default as Search } from './Search.tsx';",
    );
  });

  it('should create a custom export for every component using the template passed', async () => {
    const fakePage = figmaDocument.createPage([
      figmaDocument.component1,
      figmaDocument.component2,
    ]);
    const pages = figma.getPagesWithComponents(fakePage, {
      filterComponent: () => true,
      includeTypes: ['COMPONENT'],
    });

    await outputter({
      output: 'output',
      getExportTemplate: (options) =>
        `export { ${pascalCase(options.basename)} } from './customPath';`,
    })(pages);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(3);
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      path.resolve('output', 'fakePage', 'FigmaLogo.jsx'),
      undefined,
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      path.resolve('output', 'fakePage', 'Search.jsx'),
      undefined,
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      3,
      path.resolve('output', 'fakePage', 'index.js'),

      "export { FigmaLogo } from './customPath';\n" +
        "export { Search } from './customPath';",
    );
  });

  it('should create folder if component names contain slashes', async () => {
    const fakePage = figmaDocument.createPage([
      figmaDocument.componentWithSlashedName,
    ]);
    const pages = figma.getPagesWithComponents(fakePage, {
      filterComponent: () => true,
      includeTypes: ['COMPONENT'],
    });

    await outputter({
      output: 'output',
    })(pages);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      path.resolve('output', 'fakePage', 'icon', 'FigmaLogo.jsx'),
      undefined,
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      path.resolve('output', 'fakePage', 'icon', 'index.js'),
      "export { default as FigmaLogo } from './FigmaLogo.jsx';",
    );
  });

  describe('options', () => {
    const fakePage = figmaDocument.createPage([
      figmaDocument.componentWithSlashedName,
    ]);
    const pages = figma.getPagesWithComponents(fakePage, {
      filterComponent: () => true,
      includeTypes: ['COMPONENT'],
    });

    it('should be able to customize "dirname"', async () => {
      await outputter({
        output: 'output',
        getDirname: (options) => `${options.dirname}`,
      })(pages);

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        path.resolve('output', 'icon', 'FigmaLogo.jsx'),
        undefined,
      );
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        path.resolve('output', 'icon', 'index.js'),
        "export { default as FigmaLogo } from './FigmaLogo.jsx';",
      );
    });

    it('should be able to customize "componentName" (also "componentFilename" will be updated if not set)', async () => {
      await outputter({
        output: 'output',
        getComponentName: (options) => options.basename.toUpperCase(),
      })(pages);

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        path.resolve('output', 'fakePage', 'icon', 'FIGMA-LOGO.jsx'),
        undefined,
      );
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        path.resolve('output', 'fakePage', 'icon', 'index.js'),
        "export { default as FIGMA-LOGO } from './FIGMA-LOGO.jsx';",
      );
    });

    it('should be able to customize "componentFilename"', async () => {
      await outputter({
        output: 'output',
        getComponentFilename: (options) =>
          kebabCase(options.basename).toLowerCase(),
      })(pages);

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        path.resolve('output', 'fakePage', 'icon', 'figma-logo.jsx'),
        undefined,
      );
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        path.resolve('output', 'fakePage', 'icon', 'index.js'),
        "export { default as FigmaLogo } from './figma-logo.jsx';",
      );
    });

    it('should be able to customize both "componentName" and "componentFilename"', async () => {
      await outputter({
        output: 'output',
        getComponentName: (options) => options.basename.toUpperCase(),
        getComponentFilename: (options) => camelCase(options.basename),
      })(pages);

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        path.resolve('output', 'fakePage', 'icon', 'figmaLogo.jsx'),
        undefined,
      );
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        path.resolve('output', 'fakePage', 'icon', 'index.js'),
        "export { default as FIGMA-LOGO } from './figmaLogo.jsx';",
      );
    });

    it('should be able to customize "fileExtension"', async () => {
      await outputter({
        output: 'output',
        getFileExtension: () => '.js',
      })(pages);

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        path.resolve('output', 'fakePage', 'icon', 'FigmaLogo.js'),
        undefined,
      );
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        path.resolve('output', 'fakePage', 'icon', 'index.js'),
        "export { default as FigmaLogo } from './FigmaLogo.js';",
      );
    });

    it('should be able to customize "svgrConfig"', async () => {
      const pagesWithSvg = await figma.enrichPagesWithSvg(
        client,
        'fileABCD',
        pages,
      );

      await outputter({
        output: 'output',
        getSvgrConfig: () => ({ native: true }),
      })(pagesWithSvg);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.resolve('output', 'fakePage', 'icon', 'FigmaLogo.jsx'),
        undefined,
      );
      expect(svgr.transform.sync).toHaveBeenCalledWith(
        figmaDocument.componentWithSlashedNameOutput.svg,
        {
          native: true,
        },
        {
          componentName: 'FigmaLogo',
        },
      );
    });
  });
});
