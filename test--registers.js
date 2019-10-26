/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiThings = require('chai-things');

chai.use(sinonChai);
chai.use(chaiThings);

global.sinon = sinon;
global.chai = chai;

let consoleSandbox;
beforeEach(() => {
    consoleSandbox = sinon.createSandbox();
    console.log = consoleSandbox.spy();
    console.error = consoleSandbox.spy();
    console.warn = consoleSandbox.spy();
    console.clear = consoleSandbox.spy();
    console.info = consoleSandbox.spy();
});

afterEach(() => {
    consoleSandbox.restore();
});
