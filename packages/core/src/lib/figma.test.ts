import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type * as Figma from 'figma-js';

import FigmaJS from 'figma-js';
import * as figmaDocument from './_config.helper-test.js';
import * as figma from './figma.js';

vi.mock('figma-js');

const getComponentsDefaultOptions: Parameters<typeof figma.getComponents>[1] = {
  filterComponent: () => true,
  includeTypes: ['COMPONENT'],
};

describe('figma.', () => {
  beforeEach(() => {
    nock(figmaDocument.svg.domain, {
      reqheaders: { 'Content-Type': 'images/svg+xml' },
    })
      .get(figmaDocument.svg.path)
      .reply(200, figmaDocument.svg.content);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('', () => {
    it('should throw an error if styles are not present', async () => {
      const client = {
        ...({} as Figma.ClientInterface),
        file: vi.fn().mockResolvedValue({ data: {} }),
      };

      await expect(() =>
        figma.getStyles(client, { fileId: 'ABC123' }),
      ).rejects.toThrow("'styles' are missing.");
    });
  });

  describe('getComponents', () => {
    it('should get zero results if no children are provided', () => {
      expect(figma.getComponents([], getComponentsDefaultOptions)).to.eql([]);
    });

    it('should get all components from a list of children', () => {
      expect(
        figma.getComponents(
          [figmaDocument.component1, figmaDocument.group1],
          getComponentsDefaultOptions,
          [{ name: 'A Frame', type: 'FRAME' }],
        ),
      ).to.eql([
        figmaDocument.componentOutput1,
        figmaDocument.componentOutput3,
      ]);
    });

    it('should get all instances from a list of children', () => {
      expect(
        figma.getComponents(
          [figmaDocument.component1, figmaDocument.group1],
          {
            filterComponent: () => true,
            includeTypes: ['INSTANCE'],
          },
          [{ name: 'A Frame', type: 'FRAME' }],
        ),
      ).to.eql([figmaDocument.instanceComponentOutput1]);
    });

    it('should get all components and instances from a list of children', () => {
      expect(
        figma.getComponents(
          [figmaDocument.component1, figmaDocument.group1],
          {
            filterComponent: () => true,
            includeTypes: ['COMPONENT', 'INSTANCE'],
          },
          [{ name: 'A Frame', type: 'FRAME' }],
        ),
      ).to.eql([
        figmaDocument.componentOutput1,
        figmaDocument.instanceComponentOutput1,
        figmaDocument.componentOutput3,
      ]);
    });
  });

  describe('getPagesWithComponents', () => {
    const document = figmaDocument.createDocument({
      children: [figmaDocument.page1, figmaDocument.page2],
    });

    it('should get all pages by default', () => {
      const pages = figma.getPagesWithComponents(
        document,
        getComponentsDefaultOptions,
      );
      expect(pages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'page1' }),
          expect.objectContaining({ name: 'page2' }),
        ]),
      );
    });

    it('should be able to filter components', () => {
      const pages = figma.getPagesWithComponents(document, {
        filterComponent: (component) => ['9:1'].includes(component.id),
        includeTypes: ['COMPONENT'],
      });

      expect(pages).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ name: 'page1' }),
        ]),
      );

      expect(pages).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'page2' })]),
      );
    });

    it('should excludes pages without components', () => {
      const pages = figma.getPagesWithComponents(
        figmaDocument.createDocument({
          children: [figmaDocument.page1, figmaDocument.pageWithoutComponents],
        }),
        getComponentsDefaultOptions,
      );

      expect(pages).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'page1' })]),
      );

      expect(pages).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ name: 'page2' }),
        ]),
      );
    });
  });

  describe('getIdsFromPages', () => {
    it('should get component ids from specified pages', () => {
      const document = figmaDocument.createDocument({
        children: [figmaDocument.page1, figmaDocument.page2],
      });
      const pages = figma.getPagesWithComponents(
        document,
        getComponentsDefaultOptions,
      );

      expect(figma.getIdsFromPages(pages)).to.eql(['10:8', '8:1', '9:1']);
    });
  });

  describe('getClient', () => {
    it('should not create a figma client if no token is provided', () => {
      expect(() => {
        figma.getClient('');
      }).to.throw(Error);
    });

    it('should create a figma client providing a token', async () => {
      figma.getClient('token1234');
      expect(FigmaJS.Client).toHaveBeenCalledOnce();
      expect(FigmaJS.Client).toHaveBeenCalledWith({
        personalAccessToken: 'token1234',
      });
    });
  });

  describe('fileImages', () => {
    it('should get a pair id-url based of provided ids', async () => {
      const client = {
        ...({} as Figma.ClientInterface),
        fileImages: vi.fn().mockResolvedValue({
          data: {
            images: {
              A1: 'https://example.com/A1.svg',
              B2: 'https://example.com/B2.svg',
            },
          },
        }),
      };

      const fileImages = await figma.getImages(client, 'ABC123', ['A1', 'B2']);

      expect(client.fileImages).toHaveBeenCalledOnce();
      expect(client.fileImages).toHaveBeenCalledWith('ABC123', {
        ids: ['A1', 'B2'],
        format: 'svg',
        svg_include_id: true,
        version: undefined,
      });

      expect(fileImages).to.deep.equal({
        A1: 'https://example.com/A1.svg',
        B2: 'https://example.com/B2.svg',
      });
    });

    it('should throw an error when connection issue', async () => {
      const client = {
        ...({} as Figma.ClientInterface),
        fileImages: vi.fn().mockRejectedValue(new Error('some network error')),
      };

      await expect(
        figma.getImages(client, 'ABC123', ['A1', 'B2']),
      ).rejects.toThrow('while fetching fileImages: some network error');
    });
  });

  describe('fileSvgs', () => {
    it('should get a pair id-url based of provided ids', async () => {
      const client = {
        ...({} as Figma.ClientInterface),
        fileImages: vi.fn().mockResolvedValue({
          data: {
            images: {
              A1: figmaDocument.svg.url,
              B1: figmaDocument.svg.url,
            },
          },
        }),
      };

      const fileSvgs = await figma.fileSvgs(client, 'ABC123', ['A1', 'B1']);

      expect(client.fileImages).toHaveBeenCalledOnce();
      expect(client.fileImages).toHaveBeenCalledWith('ABC123', {
        ids: ['A1', 'B1'],
        format: 'svg',
        svg_include_id: true,
        version: undefined,
      });

      expect(fileSvgs).to.deep.equal({
        A1: figmaDocument.svg.content,
        B1: figmaDocument.svg.content,
      });
    });
  });

  describe.skip('enrichPagesWithSvg', () => {
    it('TODO: move here test from "export-components.test.ts"');
  });
});
