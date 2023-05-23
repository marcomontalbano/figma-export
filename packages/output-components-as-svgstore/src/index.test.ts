import sinon from 'sinon';
import { expect } from 'chai';

import * as figmaDocument from '../../core/src/lib/_config.test';
import * as figma from '../../core/src/lib/figma';

import fs from 'fs';
import outputter from './index';

describe('outputter as svgstore', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mkdirSync: sinon.SinonStub<any[], any>;

    beforeEach(() => {
        mkdirSync = sinon.stub(fs, 'mkdirSync').returnsArg(0);
    });

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
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1.svg',
            'id="page1/Figma-Logo"',
        );

        expect(mkdirSync).to.be.calledOnce;
        expect(mkdirSync).to.be.calledWithMatch(
            'output',
            { recursive: true },
        );
    });

    it('should create folders and subfolders when pageName contains slashes', async () => {
        const writeFileSync = sinon.stub(fs, 'writeFileSync');
        const document = figmaDocument.createDocument({ children: [figmaDocument.page1WithSlashes] });
        const pages = figma.getPages(document);

        await outputter({
            output: 'output',
        })(pages);

        expect(writeFileSync).to.be.calledOnce;
        expect(writeFileSync).to.be.calledWithMatch(
            'output/page1/subpath/subsubpath.svg',
            'id="page1/subpath/subsubpath/Figma-Logo"',
        );

        expect(mkdirSync).to.be.calledOnce;
        expect(mkdirSync).to.be.calledWithMatch(
            'output/page1/subpath',
            { recursive: true },
        );
    });
});
