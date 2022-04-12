import * as path from 'path';
import { insertClassDecoratorInFile } from '../../insert-class-decorator';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert class decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `@Model()`;
      const code = insertClassDecoratorInFile(filePath, {
        codeToInsert,
        id: 'myClass',
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
      const codeToInsert = `@Model()`;
      const code = insertClassDecoratorInFile(filePath, {
        codeToInsert,
        id: 'myClass',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('insert decorator before class', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const codeToInsert = `@Model()`;
      const code = insertClassDecoratorInFile(filePath, {
        codeToInsert,
        id: 'myClass',
      });
      let codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      const str = `${escapeRegExp(codeToInsert)}\\s*\\nclass myClass`;
      const regExp = new RegExp(str);
      expect(codeTxt.match(regExp)).toBeTruthy();
      expect(codeTxt.includes(origCode)).toBeTruthy();
    });
  });
});
