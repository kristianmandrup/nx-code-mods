import { insertIntoNamedArrayInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('insertIntoNamedArrayInFile', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const codeToInsert = `'c'`;
      const inserted = insertIntoNamedArrayInFile(filePath, {
        codeToInsert,
        id: 'myNamedList',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.match(codeToInsert)).toBeTruthy();
      expect(insertedTxt.match(origCode)).toBeTruthy();
    });
  });
  context('file with named array', () => {});
});
