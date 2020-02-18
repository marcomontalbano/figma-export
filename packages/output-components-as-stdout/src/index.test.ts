/* eslint-disable no-console */

import { expect } from 'chai';

import * as figmaDocument from '../../core/src/lib/_config.test';

import outputter = require('./index');

describe('outputter as stdout', () => {
    it('should output pages in console as json', async () => {
        await outputter()([figmaDocument.page1]);
        expect(console.log).to.have.been.calledOnce;
        expect(console.log).to.have.been.calledWith(`${JSON.stringify([figmaDocument.page1])}`);
    });
});
