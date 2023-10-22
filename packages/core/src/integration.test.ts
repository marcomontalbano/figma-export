import { expect } from 'chai';

import { components as exportComponents } from './lib/export-components';
import { styles as exportStyles } from './lib/export-styles';

describe('@figma-export/core', () => {
    it('Export components', async () => {
        const pageNodes = await exportComponents({
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            token: process.env.FIGMA_TOKEN ?? '',
            onlyFromPages: ['unit-test'],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            log: () => {},
        });

        // console.info(pageNodes);

        expect(pageNodes.length).to.eq(1);
        expect(pageNodes[0].components.length).to.eq(4);
        expect(pageNodes[0].components.map((c) => c.name)).to.eql([
            'figma default logo',
            'figma/logo',
            'figma/logo/main',
            'figma/logo/main (bright)',
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
        expect(styles[0].name).to.eq('purple/with/special#characters');
    }).timeout(60 * 1000);
});
