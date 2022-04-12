import { removeFromNamedObjectInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('insert object', () => {
  context('file with no named object', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-object.txt');
      const codeToInsert = `c: 3`;
      const inserted = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });
});
