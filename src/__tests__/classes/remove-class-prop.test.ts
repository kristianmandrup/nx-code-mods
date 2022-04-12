import * as path from 'path';
import { removeClassMethodInFile } from '../..';

const context = describe;

describe('insert class method', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `myMethod() {}`;

      const code = removeClassMethodInFile(filePath, {
        className: 'myClass',
        methodId: 'myMethod',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });
});
