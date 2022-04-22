import * as path from 'path';
import { replaceClassMethodDecoratorInFile } from '../../..';
// import { escapeRegExp } from '../../../utils';

const context = describe;

const replaceCode = '@Post';

describe('replace class method decorator', () => {
  context('file has no class', () => {
    it('no replace', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = replaceClassMethodDecoratorInFile(filePath, {
        code: replaceCode,
        classId: 'myClass',
        methodId: 'myMethod',
        decoratorId: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(replaceCode)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no replace', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-no-matching-class.txt',
      );
      const code = replaceClassMethodDecoratorInFile(filePath, {
        code: replaceCode,
        classId: 'myClass',
        methodId: 'myMethod',
        decoratorId: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(replaceCode)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no replace', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-empty-class.txt',
      );
      const code = replaceClassMethodDecoratorInFile(filePath, {
        code: replaceCode,
        classId: 'myClass',
        methodId: 'myMethod',
        decoratorId: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method with matching decorator', () => {
    it('replace decorator before matching method', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-method-decorator.txt',
      );
      const code = replaceClassMethodDecoratorInFile(filePath, {
        code: replaceCode,
        classId: 'myClass',
        methodId: 'myMethod',
        decoratorId: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes('@Post')).toBeFalsy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
