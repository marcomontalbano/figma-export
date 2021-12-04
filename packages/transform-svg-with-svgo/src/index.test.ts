import sinon from 'sinon';
import { expect } from 'chai';

import transformer = require('./index');

const svg = `
<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" fill="white"/>
</svg>`;

describe('transform svg with svgo', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should optimize a given svg with svgo', async () => {
        const actualSvg = await transformer({})(svg);

        expect(actualSvg).to.be.eql(
            '<svg width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M0 0h50v50H0z"/></svg>',
        );
    });

    it('should handle exception when something fails', async () => {
        const actualSvg = await transformer({})('bad svg');
        await expect(actualSvg).to.be.undefined;
    });
});
