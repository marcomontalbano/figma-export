import { afterEach, describe, expect, it, vi } from 'vitest';
import * as figmaDocument from '../../core/src/lib/_config.helper-test.js';
import * as figma from '../../core/src/lib/figma.js';

import fs from 'node:fs';
import path from 'node:path';
import outputter from './index.js';

vi.mock('fs');

describe('outputter as svg', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should export all components into svg files', async () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1],
    });
    const pages = figma.getPagesWithComponents(
      figmaDocument.createFile({ document, components: {} }),
      {
        filterComponent: () => true,
        includeTypes: ['COMPONENT'],
      },
    );

    await outputter({
      output: 'output',
    })(pages);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      path.resolve('output', 'page1', 'Figma-Logo.svg'),
      '',
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      path.resolve('output', 'page1', 'Search.svg'),
      '',
    );
  });

  it('should create folder if component names contain slashes', async () => {
    const fakePages = figmaDocument.createPage([
      figmaDocument.componentWithSlashedName,
    ]);
    const pages = figma.getPagesWithComponents(
      figmaDocument.createFile({ document: fakePages, components: {} }),
      {
        filterComponent: () => true,
        includeTypes: ['COMPONENT'],
      },
    );

    await outputter({
      output: 'output',
    })(pages);

    expect(fs.writeFileSync).toHaveBeenCalledOnce();
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      path.resolve('output', 'fakePage', 'icon', 'Figma-logo.svg'),
      '',
    );
  });

  describe('options', () => {
    const fakePages = figmaDocument.createPage([
      figmaDocument.componentWithSlashedName,
    ]);
    const pages = figma.getPagesWithComponents(
      figmaDocument.createFile({ document: fakePages, components: {} }),
      {
        filterComponent: () => true,
        includeTypes: ['COMPONENT'],
      },
    );

    it('should be able to customize "basename"', async () => {
      await outputter({
        output: 'output',
        getBasename: (options) => `${options.pageName}-${options.basename}.svg`,
      })(pages);

      expect(fs.writeFileSync).toHaveBeenCalledOnce();
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        path.resolve('output', 'fakePage', 'icon', 'fakePage-Figma-logo.svg'),
        '',
      );
    });

    it('should be able to customize "dirname"', async () => {
      await outputter({
        output: 'output',
        getBasename: (options) => `${options.pageName}-${options.basename}.svg`,
        getDirname: (options) => `${options.dirname}`,
      })(pages);

      expect(fs.writeFileSync).toHaveBeenCalledOnce();
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        path.resolve('output', 'icon', 'fakePage-Figma-logo.svg'),
        '',
      );
    });
  });
});
