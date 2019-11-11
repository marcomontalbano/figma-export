/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const { expect } = chai;

const figmaDocument = require('../core/lib/_config.test');

const outputter = require('./index');

describe('outputter as stdout', () => {
    it('should output pages in console as json', async () => {
        await outputter({})([figmaDocument.page1]);
        expect(console.log).to.have.been.calledOnce;
        expect(console.log).to.have.been.calledWith(`${JSON.stringify([figmaDocument.page1])}`);
    });
});
