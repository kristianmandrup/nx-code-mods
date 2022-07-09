import * as path from 'path';
import { replaceClassMethodParamDecoratorsInFile } from '../../../replace';

const context = describe;

const replaceCode = '@Body';

describe('replace class method param decorator', () => {
  context('file has no class', () => {
    it('no replace', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = replaceClassMethodParamDecoratorsInFile(filePath, {
        code: replaceCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'myParam',
        replace: {
          index: 1,
        },
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
      const code = replaceClassMethodParamDecoratorsInFile(filePath, {
        code: replaceCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'myParam',
        replace: {
          index: 1,
        },
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
      const code = replaceClassMethodParamDecoratorsInFile(filePath, {
        code: replaceCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'myParam',
      });
      let modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(replaceCode)).toBeFalsy();
    });
  });
});
