import * as path from 'path';
import { insertClassMethodDecoratorInFile } from '../../../';
import { escapeRegExp } from '../../../utils';

const context = describe;

describe('insert class decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const code = insertClassMethodDecoratorInFile(filePath, {
        code: `@Post()`,
        classId: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(code)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const code = insertClassMethodDecoratorInFile(filePath, {
        code: `@Post()`,
        classId: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(code)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const code = insertClassMethodDecoratorInFile(filePath, {
        code: `@Post()`,
        classId: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it('insert decorator before matching method', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-method.txt',
      );
      const code = insertClassMethodDecoratorInFile(filePath, {
        code: `@Post()`,
        classId: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      const str = `${escapeRegExp(code)}\\s*\\nmyMethod`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.includes(code)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});