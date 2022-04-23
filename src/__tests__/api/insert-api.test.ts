import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { insertApi } from './../../insert/api';
import * as path from 'path';

const context = describe;

describe('insert api', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const source = readFileIfExisting(filePath);
      const api = insertApi({ source });
      api.inArray({
        code: `'c'`,
        varId: 'myNamedList',
      });
      const code = api.source;
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const source = readFileIfExisting(filePath);
        const api = insertApi({ source });
        api.inArray({
          code: `'c'`,
          varId: 'myNamedList',
        });
        const code = api.source;
        const modifiedCode = code ? code : '';
        expect(modifiedCode.match(/'c'\s*,\s*'a'/)).toBeTruthy();
      });
    });
  });
});
