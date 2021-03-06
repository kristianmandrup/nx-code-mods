import { insertIntoNamedArrayInFile } from '../..';
import * as path from 'path';
import { findStringLiteral } from '../../find';
import { createModuleResolutionCache, Node } from 'typescript';

const context = describe;

describe('insert array', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const code = insertIntoNamedArrayInFile(filePath, {
        code: `'c'`,
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(`'c'`)).toBeFalsy();
    });
  });

  context('file with non-matching named array', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-array.txt',
      );
      const code = insertIntoNamedArrayInFile(filePath, {
        code: `'c'`,
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const anotherList = ['a','b']`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(`'c'`)).toBeFalsy();
    });
  });

  context('file with named empty array', () => {
    it('inserts in array', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-array.txt',
      );
      const code = insertIntoNamedArrayInFile(filePath, {
        code: `'c'`,
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`const myNamedList = ['c'`)).toBeTruthy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = insertIntoNamedArrayInFile(filePath, {
          code: `'c'`,
          varId: 'myNamedList',
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`'c'\\s*,\\s*'a'\\s*,\\s*'b'\\s*\]`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at middle of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = insertIntoNamedArrayInFile(filePath, {
          code: `'c'`,
          varId: 'myNamedList',
          insert: {
            index: 1,
          },
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`'c'\\s*,\\s*'b'\\s*\]`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('end pos', () => {
      it('inserts at end of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = insertIntoNamedArrayInFile(filePath, {
          code: `'c'`,
          varId: 'myNamedList',
          insert: {
            index: 'end',
          },
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`'b'\\s*,\\s*'c'\\s*\]`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('after b string literal', () => {
      it('inserts c after b string literal', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = insertIntoNamedArrayInFile(filePath, {
          code: `'c'`,
          varId: 'myNamedList',
          insert: {
            relative: 'after',
            findElement: (node: Node) => findStringLiteral(node, 'b'),
          },
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`\[\\s*'b',\\s*'xx',\\s*'c'\]`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
        expect(modifiedCode.includes(`'c'`)).toBeTruthy();
      });
    });
  });
});
