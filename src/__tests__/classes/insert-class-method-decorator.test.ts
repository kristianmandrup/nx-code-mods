import * as path from 'path';
import { Node } from 'typescript';
import { insertClassMethodDecoratorInFile } from '../../insert-class-method-decorator';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert class decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `@Post()`;
      const inserted = insertClassMethodDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const codeToInsert = `@Post()`;
      const inserted = insertClassMethodDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const codeToInsert = `@Post()`;
      const inserted = insertClassMethodDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it('insert decorator before matching method', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-method.txt',
      );
      const codeToInsert = `@Post()`;
      const inserted = insertClassMethodDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Post',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      const str = `${escapeRegExp(codeToInsert)}\\s*\\nmyMethod`;
      const regExp = new RegExp(str);
      expect(insertedTxt.match(regExp)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeTruthy();
      expect(insertedTxt.includes(origCode)).toBeTruthy();
    });
  });
});
