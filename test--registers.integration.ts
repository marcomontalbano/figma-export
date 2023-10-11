/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import * as sinon from 'sinon';
import * as chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiThings from 'chai-things';
import chaiAsPromises from 'chai-as-promised';

chai.use(sinonChai);
chai.use(chaiThings);
chai.use(chaiAsPromises);

let consoleSandbox: sinon.SinonSandbox;
beforeEach(() => {
    consoleSandbox = sinon.createSandbox();
    // console.log = consoleSandbox.spy();
    // console.error = consoleSandbox.spy();
    // console.warn = consoleSandbox.spy();
    // console.clear = consoleSandbox.spy();
    // console.info = consoleSandbox.spy();
});

afterEach(() => {
    consoleSandbox.restore();
});
