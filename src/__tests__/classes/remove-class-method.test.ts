import * as path from 'path';
import { removeClassMethodInFile } from '../..';

const context = describe;

describe('insert class method', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `myMethod() {}`;

      const inserted = removeClassMethodInFile(filePath, {
        className: 'myClass',
        methodId: 'myMethod',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });
});
