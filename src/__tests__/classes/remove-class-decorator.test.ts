import * as path from 'path';
import { removeClassDecoratorInFile } from '../../remove-class-decorator';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('remove class decorator', () => {
  context('file has no class', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const code = removeClassDecoratorInFile(filePath, {
        classId: 'myClass',
        id: 'Model',
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
        'files',
        'has-no-matching-class.txt',
      );
      const code = removeClassDecoratorInFile(filePath, {
        classId: 'myClass',
        id: 'Model',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching empty class', () => {
    it('remove decorator before class', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const code = removeClassDecoratorInFile(filePath, {
        classId: 'myClass',
        id: 'Model',
      });
      let modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      // expect(modifiedCode.includes(origCode)).toBeTruthy();
      // const str = `${escapeRegExp(codeToRemove)}\\s*\\nclass myClass`;
      // const regExp = new RegExp(str);
      // expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
