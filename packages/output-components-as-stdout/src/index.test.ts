import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import * as figmaDocument from '../../core/src/lib/_config.helper-test.js';
import * as figma from '../../core/src/lib/figma.js';

import outputter from './index.js';

describe('outputter as stdout', () => {
    beforeEach(() => {
        vi.stubGlobal('console', {
            log: vi.fn(),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should output pages in console as json', async () => {
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages = figma.getPagesWithComponents(document, {
            filterComponent: () => true,
            includeTypes: ['COMPONENT'],
        });
        await outputter()(pages);

        // eslint-disable-next-line no-console
        expect(console.log).toHaveBeenCalledOnce();
        // eslint-disable-next-line no-console
        expect(console.log).toHaveBeenCalledWith(`${JSON.stringify(pages)}`);
    });
});
