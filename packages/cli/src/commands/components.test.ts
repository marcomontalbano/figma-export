/* eslint-disable import/no-extraneous-dependencies */

import sinon from 'sinon';
import { expect, test } from '@oclif/test';

import * as figmaExport from '@figma-export/core';

describe('components', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should stdout a proper message with a fileId and an outputter', () => {
        sinon.stub(figmaExport, 'components').returns(Promise.resolve([]));

        test
            .stdout()
            .command(['components', 'fzYhvQpqwhZDUImRz431Qo', '-O', '@figma-export/output-components-as-svg'])
            .it((ctx) => {
                expect(ctx.stdout).to.contain('Exporting fzYhvQpqwhZDUImRz431Qo with [] as [@figma-export/output-components-as-svg]');
            });
    });

    it('should throw an error with invalid fields (rejection)', () => {
        sinon.stub(figmaExport, 'components').returns(Promise.reject(new Error('Something went wrong')));

        test
            .stdout()
            .command(['components', 'fzYhvQpqwhZDUImRz431Qo', '-O', '@figma-export/output-components-as-svg'])
            .exit(1)
            .it();
    });
});
