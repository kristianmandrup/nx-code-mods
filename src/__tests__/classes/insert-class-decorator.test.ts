import { findIdentifier } from './../../find';
import { insertIntoNamedObjectInFile } from '../..';
import * as path from 'path';
import { Node } from 'typescript';
import { insertClassDecoratorInFile } from '../../insert-class-decorator';

const context = describe;

describe('insert class decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `@Model()`;
      const inserted = insertClassDecoratorInFile(filePath, {
        codeToInsert,
        id: 'myClass',
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
      const codeToInsert = `@Model()`;
      const inserted = insertClassDecoratorInFile(filePath, {
        codeToInsert,
        id: 'myClass',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching class', () => {
    it('insert decorator before class', () => {
      const filePath = path.join(__dirname, 'files', 'has-matching-class.txt');
      const codeToInsert = `@Model()`;
      const inserted = insertClassDecoratorInFile(filePath, {
        codeToInsert,
        id: 'myClass',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      console.log({ insertedTxt });
      expect(insertedTxt.includes(codeToInsert)).toBeTruthy();
      expect(insertedTxt.includes(origCode)).toBeTruthy();
    });
  });
});
