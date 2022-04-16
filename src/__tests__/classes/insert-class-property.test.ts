import * as path from 'path';
import { insertClassPropertyInFile } from '../../';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert class property', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `myProp: User`;
      const code = insertClassPropertyInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        propId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const codeToInsert = `myProp: User`;
      const code = insertClassPropertyInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        propId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('inserts prop', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const codeToInsert = `myProp: User`;
      const code = insertClassPropertyInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        propId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeTruthy();
    });
  });

  context('file has matching class no matching property', () => {
    it('inserts method', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-no-matching-property.txt',
      );
      const codeToInsert = `myProp: User`;
      const code = insertClassPropertyInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        propId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      const str = `${escapeRegExp(codeToInsert)}\\s*;\\s*propA`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file has matching class and property', () => {
    it('aborts, no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-property.txt',
      );
      const codeToInsert = `getUser(): User {}`;
      const code = insertClassPropertyInFile(filePath, {
        codeToInsert,
        classId: 'myClass',
        propId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });
});
