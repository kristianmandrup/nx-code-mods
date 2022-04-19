import { chainApiFromFile } from './../../api/chain';
import * as path from 'path';

const context = describe;

describe('chain api', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const api = chainApiFromFile(filePath);
      api.insert.inArray({
        code: `'c'`,
        varId: 'myNamedList',
      });
      const code = api.source;
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(code)).toBeFalsy();
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
        const api = chainApiFromFile(filePath);
        api.insert.inArray({
          code: `'c'`,
          varId: 'myNamedList',
        });
        const code = api.source;
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'c','a'`)).toBeTruthy();
      });
    });
  });
});
