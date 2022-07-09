import * as path from 'path';
import { removeClassMethodDecoratorInFile } from '../../..';
// import { escapeRegExp } from '../../../utils';

const context = describe;

const removeCode = '@Post';

describe('remove class method decorator', () => {
  context('file has no class', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = removeClassMethodDecoratorInFile(filePath, {
        classId: 'myClass',
        methodId: 'myMethod',
        decoratorId: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(removeCode)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-no-matching-class.txt',
      );
      const code = removeClassMethodDecoratorInFile(filePath, {
        classId: 'myClass',
        methodId: 'myMethod',
        decoratorId: 'Post',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(removeCode)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-empty-class.txt',
      );
      const code = removeClassMethodDecoratorInFile(filePath, {
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
    it('remove decorator before matching method', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-method-decorator.txt',
      );
      const code = removeClassMethodDecoratorInFile(filePath, {
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
