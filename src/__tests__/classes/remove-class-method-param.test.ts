import * as path from 'path';
import { removeClassMethodParamsInFile } from '../..';

const context = describe;

describe('remove class method param', () => {
  context('file has no class', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `myMethod() {}`;

      const code = removeClassMethodParamsInFile(filePath, {
        className: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const code = removeClassMethodParamsInFile(filePath, {
        className: 'myClass',
        methodId: 'myMethod',
        remove: {
          index: 1,
        },
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching empty class', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const code = removeClassMethodParamsInFile(filePath, {
        className: 'myClass',
        methodId: 'myMethod',
      });
      let modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // const str = `${escapeRegExp(codeToInsert)}\\s*\\nclass myClass`;
      // const regExp = new RegExp(str);
      // expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
