import * as path from 'path';
import { insertClassMethodInFile } from '../../insert-class-method';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert class method', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `myMethod() {}`;

      const code = insertClassMethodInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const codeToInsert = `myMethod() {}`;

      const code = insertClassMethodInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('inserts method', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const codeToInsert = `myMethod() {}`;
      const code = insertClassMethodInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      const str = `${escapeRegExp(codeToInsert + ';')}\\s*}`;
      const regExp = new RegExp(str);
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file has matching class no matching method', () => {
    it('inserts method', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-no-matching-method.txt',
      );
      const codeToInsert = `myMethod() {}`;
      const code = insertClassMethodInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      const str = `${escapeRegExp(codeToInsert)}\\s*;\\s*methodA`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it('aborts, no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-method.txt',
      );
      const codeToInsert = `myMethod() {}
  `;
      const code = insertClassMethodInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });
});
