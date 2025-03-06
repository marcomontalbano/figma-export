import { describe, expect, it } from 'vitest';

import { writeVariable } from './utils.js';

describe('utils', () => {
  describe('writeVariable', () => {
    describe('JSON', () => {
      it('should return empty string is the value is empty', () => {
        const obj = {};
        writeVariable(obj, 'This is a comment', 'variable-name', '');

        expect(obj).to.eql({});
      });

      it('should be able to print-out simple variable', () => {
        const obj = {};
        writeVariable(obj, 'This is a comment', 'variable-name', '#fff');

        expect(obj).to.eql({
          variable: {
            name: {
              value: '#fff',
              comment: 'This is a comment',
            },
          },
        });
      });

      it('should be able to print-out simple variable with an empty comment', () => {
        const obj = {};
        writeVariable(obj, '', 'variable-name', '#fff');
        expect(obj).to.eql({
          variable: {
            name: {
              value: '#fff',
              comment: undefined,
            },
          },
        });
      });

      it('should be able to print-out a comment with special chars', () => {
        const obj = {};
        writeVariable(
          obj,
          'Incomprehensible comment :) !"£$%&/()=?^*/\n/*/*/*/*////\n§°ç*é_:;][¶#@–•…*/„Ω€®™æ¨œøπ¬ºª∆∞ƒ∂ßå≤∑†©√∫˜µ*/',
          'variable-name',
          '#fff',
        );

        expect(obj).to.eql({
          variable: {
            name: {
              value: '#fff',
              comment:
                'Incomprehensible comment :) !"£$%&/()=?^ //// §°ç*é_:;][¶#@–•…„Ω€®™æ¨œøπ¬ºª∆∞ƒ∂ßå≤∑†©√∫˜µ',
            },
          },
        });
      });

      it('should be able to print-out a complex variable', () => {
        const obj = {};
        writeVariable(
          obj,
          'This is a comment\nin two lines',
          'variable-name',
          'linear-gradient(104.57deg, rgba(184, 89, 255, 1) 0%, rgba(10, 207, 131, 0) 100%)',
        );

        expect(obj).to.eql({
          variable: {
            name: {
              value:
                'linear-gradient(104.57deg, rgba(184, 89, 255, 1) 0%, rgba(10, 207, 131, 0) 100%)',
              comment: 'This is a comment in two lines',
            },
          },
        });
      });
    });
  });
});
