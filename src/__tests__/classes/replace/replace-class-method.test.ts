import * as path from 'path';
import { replaceClassMethodInFile } from '../../..';

const context = describe;

describe('replace class method', () => {
  context('file has no class', () => {
    it('no replace', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const code = replaceClassMethodInFile(filePath, {
        code: `myMethod() {}`,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(code)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no replace', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const code = replaceClassMethodInFile(filePath, {
        code: `myMethod() {}`,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching empty class', () => {
    it('replace decorator before class', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const code = replaceClassMethodInFile(filePath, {
        code: `myMethod() {}`,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      let modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // const str = `${escapeRegExp(code)}\\s*\\nclass myClass`;
      // const regExp = new RegExp(str);
      // expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
