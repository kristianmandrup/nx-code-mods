import * as path from 'path';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { replaceApi } from '../../replace';

const context = describe;

describe('replace api', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const source = readFileIfExisting(filePath);
      const api = replaceApi({ source });
      api.inArray({
        varId: 'myNamedList',
        code: `'c'`,
      });
      const code = api.source;
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(`'c'`)).toBeTruthy();
      expect(modifiedCode.includes(`'a'`)).toBeFalsy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it.skip('replaces first element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );
        const source = readFileIfExisting(filePath);
        const api = replaceApi({ source });
        api.inArray({
          varId: 'myNamedList',
          code: `'xx'`,
        });
        const code = api.source;
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
        expect(modifiedCode.includes(`'xx'`)).toBeTruthy();
        expect(modifiedCode.includes(`'a'`)).toBeFalsy();
      });
    });
  });
});
