import { insertIntoNamedArrayInFile } from '../..';
import * as path from 'path';
import { findStringLiteral } from '../../find';
import { Node } from 'typescript';

const context = describe;

describe('insert array', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const codeToInsert = `'c'`;
      const code = insertIntoNamedArrayInFile(filePath, {
        codeToInsert,
        id: 'myNamedList',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
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
      const code = insertIntoNamedArrayInFile(filePath, {
        codeToInsert,
        id: 'myNamedList',
      });
      const codeTxt = code ? code : '';
      const origCode = `const anotherList = ['a','b']`;
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
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
      const code = insertIntoNamedArrayInFile(filePath, {
        codeToInsert,
        id: 'myNamedList',
      });
      const codeTxt = code ? code : '';
      expect(codeTxt.includes(`const myNamedList = ['c'`)).toBeTruthy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );
        const codeToInsert = `'c'`;
        const code = insertIntoNamedArrayInFile(filePath, {
          codeToInsert,
          id: 'myNamedList',
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'c','a'`)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at middle of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );
        const codeToInsert = `'c'`;
        const code = insertIntoNamedArrayInFile(filePath, {
          codeToInsert,
          id: 'myNamedList',
          insert: {
            index: 1,
          },
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'c','b'`)).toBeTruthy();
      });
    });

    context('end pos', () => {
      it('inserts at end of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );
        const codeToInsert = `'c'`;
        const code = insertIntoNamedArrayInFile(filePath, {
          codeToInsert,
          id: 'myNamedList',
          insert: {
            index: 'end',
          },
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'b','c'`)).toBeTruthy();
      });
    });

    context('after b string literal', () => {
      it('inserts after b string literal', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );

        const codeToInsert = `'c'`;
        const code = insertIntoNamedArrayInFile(filePath, {
          codeToInsert,
          id: 'myNamedList',
          insert: {
            relative: 'after',
            findElement: (node: Node) => findStringLiteral(node, 'b'),
          },
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'b','c'`)).toBeTruthy();
      });
    });
  });
});
