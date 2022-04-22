import * as path from 'path';
import { removeClassMethodParamsInFile } from '../../..';

const context = describe;

describe('remove class method param', () => {
  context('file has no class', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = removeClassMethodParamsInFile(filePath, {
        classId: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
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
      const code = removeClassMethodParamsInFile(filePath, {
        classId: 'myClass',
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
        '..',
        'files',
        'has-matching-empty-class.txt',
      );
      const code = removeClassMethodParamsInFile(filePath, {
        classId: 'myClass',
        methodId: 'myMethod',
      });
      let modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
