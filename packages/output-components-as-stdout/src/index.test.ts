/* eslint-disable no-console */

import { expect } from 'chai';

import * as figmaDocument from '../../core/src/lib/_config.test';
import * as figma from '../../core/src/lib/figma';

import outputter = require('./index');

describe('outputter as stdout', () => {
    it('should output pages in console as json', async () => {
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1] });
        const pages = figma.getPages(document);
        await outputter()(pages);
        expect(console.log).to.have.been.calledOnce;
        expect(console.log).to.have.been.calledWith(`${JSON.stringify(pages)}`);
    });
});
