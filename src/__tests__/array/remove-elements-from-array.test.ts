import { removeFromNamedArrayInFile } from '../..';
import * as path from 'path';
import { findStringLiteral } from '../../find';
import { Node } from 'typescript';

const context = describe;

describe('remove from array', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const codeToInsert = `'c'`;
      const code = removeFromNamedArrayInFile(filePath, {
        id: 'myNamedList',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
      expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file with non-matching named array', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-array.txt',
      );
      const code = removeFromNamedArrayInFile(filePath, {
        id: 'myNamedList',
      });
      const codeTxt = code ? code : '';
      const origCode = `const anotherList = ['a','b']`;
      expect(codeTxt.includes(origCode)).toBeTruthy();
      // expect(codeTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file with named empty array', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-array.txt',
      );
      const code = removeFromNamedArrayInFile(filePath, {
        id: 'myNamedList',
      });
      const codeTxt = code ? code : '';
      expect(codeTxt.includes(`const myNamedList = []`)).toBeTruthy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it('removes first element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          id: 'myNamedList',
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'b'`)).toBeTruthy();
        expect(codeTxt.includes(`'a'`)).toBeFalsy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at middle of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          id: 'myNamedList',
          remove: {
            index: 1,
          },
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'a'`)).toBeTruthy();
        expect(codeTxt.includes(`'b'`)).toBeFalsy();
      });
    });

    context('last pos', () => {
      it('removes last element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          id: 'myNamedList',
          remove: {
            index: 'last',
          },
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'b','c'`)).toBeTruthy();
      });
    });

    context('after b string literal', () => {
      it('remove after b string literal', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-elements.txt',
        );

        const code = removeFromNamedArrayInFile(filePath, {
          id: 'myNamedList',
          remove: {
            relative: 'after',
            findElement: (node: Node) => findStringLiteral(node, 'a'),
          },
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`'a'`)).toBeTruthy();
        expect(codeTxt.includes(`'b'`)).toBeFalsy();
      });
    });
  });
});
