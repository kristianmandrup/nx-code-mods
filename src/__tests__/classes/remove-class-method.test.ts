import * as path from 'path';
import { removeClassMethodInFile } from '../..';

const context = describe;

describe('remove class method', () => {
  context('file has no class', () => {
    it('no remove', () => {
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

  context('file has no matching class', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const code = removeClassMethodInFile(filePath, {
        className: 'myClass',
        methodId: 'myMethod',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching empty class', () => {
    it('remove decorator before class', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const code = removeClassMethodInFile(filePath, {
        className: 'myClass',
        methodId: 'myMethod',
      });
      let codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      // const str = `${escapeRegExp(codeToInsert)}\\s*\\nclass myClass`;
      // const regExp = new RegExp(str);
      // expect(codeTxt.match(regExp)).toBeTruthy();
      expect(codeTxt.includes(origCode)).toBeTruthy();
    });
  });
});
