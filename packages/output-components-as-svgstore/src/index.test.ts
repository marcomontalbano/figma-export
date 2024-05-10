import {
    expect, describe, it, vi, afterEach,
} from 'vitest';

import * as figmaDocument from '../../core/src/lib/_config.helper-test.js';
import * as figma from '../../core/src/lib/figma.js';

import fs from 'fs';
import path from 'path';
import outputter from './index.js';

vi.mock('fs');

describe('outputter as svgstore', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should create an svg with the page name as filename', async () => {
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages = figma.getPagesWithComponents(document, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
        })(pages);

        expect(fs.writeFileSync).toHaveBeenCalledOnce();
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            path.resolve('output', 'page1.svg'),

            // eslint-disable-next-line max-len
            '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><symbol id="page1/Figma-Logo"/><symbol id="page1/Search"/></svg>',
        );

        expect(fs.mkdirSync).toHaveBeenCalledOnce();
        expect(fs.mkdirSync).toHaveBeenCalledWith(
            path.resolve('output'),
            { recursive: true },
        );
    });

    it('should create folders and subfolders when pageName contains slashes', async () => {
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1WithSlashes] });
        const pages = figma.getPagesWithComponents(document, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });

        await outputter({
            output: 'output',
        })(pages);

        expect(fs.writeFileSync).toHaveBeenCalledOnce();
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            path.resolve('output', 'page1', 'subpath', 'subsubpath.svg'),

            // eslint-disable-next-line max-len
            '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><symbol id="page1/subpath/subsubpath/Figma-Logo"/><symbol id="page1/subpath/subsubpath/Search"/></svg>',
        );

        expect(fs.mkdirSync).toHaveBeenCalledOnce();
        expect(fs.mkdirSync).toHaveBeenCalledWith(
            path.resolve('output', 'page1', 'subpath'),
            { recursive: true },
        );
    });
});
