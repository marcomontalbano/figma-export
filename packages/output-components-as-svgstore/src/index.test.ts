import sinon from 'sinon';
import { expect } from 'chai';

import * as figmaDocument from '../../core/src/lib/_config.test';
import * as figma from '../../core/src/lib/figma';

// eslint-disable-next-line import/order
import fs = require('fs');
import outputter = require('./index');

describe('outputter as svgstore', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should create an svg with the page name as filename', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages = figma.getPages(document);

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch('output/page1.svg');
        expect(writeFileSync.getCall(0).args[1].toString()).to.be.contain('id="page1/Figma-Logo"');
    });
});
