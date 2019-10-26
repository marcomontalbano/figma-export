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

let sandbox;
beforeEach(() => {
    sandbox = sinon.createSandbox();
    console.log = sandbox.spy();
    console.error = sandbox.spy();
    console.warn = sandbox.spy();
    console.clear = sandbox.spy();
});

afterEach(() => {
    sandbox.restore();
});
