import * as path from 'path';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { removeApi } from '../../remove';

const context = describe;

describe('remove api', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const source = readFileIfExisting(filePath);
      const api = removeApi({ source });
      api.fromArray({
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
      it('removes first element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const source = readFileIfExisting(filePath);
        const api = removeApi({ source });
        api.fromArray({
          varId: 'myNamedList',
        });
        const code = api.source;
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
        expect(modifiedCode.includes(`'a'`)).toBeFalsy();
      });
    });
  });
});
