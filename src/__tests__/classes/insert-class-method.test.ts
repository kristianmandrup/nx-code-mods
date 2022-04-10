import * as path from 'path';
import { insertClassMethodInFile } from '../../insert-class-method';

const context = describe;

describe('insert class method', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `getUser(): User {}
      `;

      const inserted = insertClassMethodInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
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
      const codeToInsert = `getUser(): User {}
  `;

      const inserted = insertClassMethodInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it.only('inserts method', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const codeToInsert = `getUser(): User {}
  `;
      const inserted = insertClassMethodInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it('aborts, no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-method.txt',
      );
      const codeToInsert = `getUser(): User {}
  `;
      const inserted = insertClassMethodInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });
});
