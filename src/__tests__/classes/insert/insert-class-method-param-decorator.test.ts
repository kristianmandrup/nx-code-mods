import * as path from 'path';
import { insertClassMethodParamDecoratorInFile } from '../../../';
import { escapeRegExp } from '../../../utils';

const context = describe;
const insertCode = `@Body()`;

describe('insert class method param decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'Body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-no-matching-class.txt',
      );
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'Body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-empty-class.txt',
      );
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'Body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-and-method.txt',
      );
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(insertCode)).toBeFalsy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it.only('insert param decorator', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-method-2-params.txt',
      );
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      const str = `${escapeRegExp('myMethod(' + insertCode)}`;
      const regExp = new RegExp(str);
      console.log({ modifiedCode });
      expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
