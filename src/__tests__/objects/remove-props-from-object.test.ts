import { removeFromNamedObjectInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('insert object', () => {
  context('file with no named object', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'no-object.txt');
      const codeToInsert = `c: 3`;
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file with non-matching named object', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-object.txt',
      );
      const codeToInsert = `c: 3`;
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const codeTxt = code ? code : '';
      const origCode = `const anotherObj = {a: 1,b: 2}`;
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file with named empty object', () => {
    it.only('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-object.txt',
      );
      const codeToInsert = `c: 3`;
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const codeTxt = code ? code : '';
      const origCode = `const myNamedObj = {}`;
      console.log({ codeTxt });
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });
});
