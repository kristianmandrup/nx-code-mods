import { insertIntoNamedArrayInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('insert array', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const codeToInsert = `'c'`;
      const inserted = insertIntoNamedArrayInFile(filePath, {
        codeToInsert,
        id: 'myNamedList',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file with non-matching named array', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-array.txt',
      );
      const codeToInsert = `'c'`;
      const inserted = insertIntoNamedArrayInFile(filePath, {
        codeToInsert,
        id: 'myNamedList',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = `const anotherList = ['a','b']`;
      expect(insertedTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named empty array', () => {
    it('inserts in array', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-array.txt',
      );
      const codeToInsert = `'c'`;
      const inserted = insertIntoNamedArrayInFile(filePath, {
        codeToInsert,
        id: 'myNamedList',
      });
      const insertedTxt = inserted ? inserted : '';
      expect(insertedTxt.includes(`const myNamedList = ['c'`)).toBeTruthy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-two-elements.txt',
        );
        const codeToInsert = `'c'`;
        const inserted = insertIntoNamedArrayInFile(filePath, {
          codeToInsert,
          id: 'myNamedList',
        });
        const insertedTxt = inserted ? inserted : '';
        expect(insertedTxt.includes(`'c','a'`)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at middle of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-two-elements.txt',
        );
        const codeToInsert = `'c'`;
        const inserted = insertIntoNamedArrayInFile(filePath, {
          codeToInsert,
          id: 'myNamedList',
          insertPos: 1,
        });
        const insertedTxt = inserted ? inserted : '';
        console.log({ insertedTxt });
        expect(insertedTxt.includes(`'c','b'`)).toBeTruthy();
      });
    });

    context('end pos', () => {
      it('inserts at end of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-two-elements.txt',
        );
        const codeToInsert = `'c'`;
        const inserted = insertIntoNamedArrayInFile(filePath, {
          codeToInsert,
          id: 'myNamedList',
          insertPos: 'end',
        });
        const insertedTxt = inserted ? inserted : '';
        console.log({ insertedTxt });
        expect(insertedTxt.includes(`'b','c'`)).toBeTruthy();
      });
    });
  });
});
