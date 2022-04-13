import * as path from 'path';
import { Node } from 'typescript';
import { insertClassMethodParamDecoratorInFile } from '../../insert-class-method-param-decorator';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert class method param decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `@Body() body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Body',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const codeToInsert = `@Body() body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Body',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const codeToInsert = `@Body() body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Body',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it.skip('insert decorator before class', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-method.txt',
      );
      const codeToInsert = `@Body() body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Body',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      const str = `${escapeRegExp('myMethod(' + codeToInsert)}`;
      const regExp = new RegExp(str);
      expect(codeTxt.match(regExp)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeTruthy();
      expect(codeTxt.includes(origCode)).toBeTruthy();
    });
  });
});
