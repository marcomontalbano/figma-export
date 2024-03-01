import { expect } from 'chai';

import { components as exportComponents } from './lib/export-components.js';
import { styles as exportStyles } from './lib/export-styles.js';

describe('@figma-export/core', () => {
    it('Export components', async () => {
        const pageNodes = await exportComponents({
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            token: process.env.FIGMA_TOKEN ?? '',
            onlyFromPages: ['138:28'],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            log: () => {},
        });

        // console.info(pageNodes);

        expect(pageNodes.length).to.eq(1);
        expect(pageNodes[0].components.length).to.eq(5);
        expect(pageNodes[0].components.map((c) => c.name)).to.eql([
            'figma default logo',
            'figma/logo',
            'figma/logo/main',
            'figma/logo/main (bright)',
            'Type=Icon only, Visible=No',
        ]);
    }).timeout(60 * 1000);

    it('Export components (only instances)', async () => {
        const pageNodes = await exportComponents({
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            token: process.env.FIGMA_TOKEN ?? '',
            onlyFromPages: ['unit-test'],
            includeTypes: ['INSTANCE'],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            log: () => {},
        });

        // console.info(pageNodes);

        expect(pageNodes.length).to.eq(1);
        expect(pageNodes[0].components.length).to.eq(1);
        expect(pageNodes[0].components.map((c) => c.name)).to.eql([
            'figma/logo/main (bright) - INSTANCE',
        ]);
    }).timeout(60 * 1000);

    it('Export styles', async () => {
        const styles = await exportStyles({
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            token: process.env.FIGMA_TOKEN ?? '',
            onlyFromPages: ['unit-test'],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            log: () => { },
        });

        // console.info(styles);

        expect(styles.length).to.eq(1);
        expect(styles.map(({ name, comment, visible }) => ({ name, comment, visible }))).to.deep.eq([
            {
                comment: 'inside a subfolder\nand newline',
                name: 'purple/with/special#characters',
                visible: true,
            },
        ]);
    }).timeout(60 * 1000);
});
