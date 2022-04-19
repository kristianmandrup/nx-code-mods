import { removeFromNamedArrayInFile } from '../..';
import * as path from 'path';
import { findStringLiteral } from '../../find';
import { Node } from 'typescript';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('remove from array', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const code = removeFromNamedArrayInFile(filePath, {
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
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
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const anotherList = ['a','b']`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
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
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      const regExp = new RegExp(`myNamedList\\s*=\\s*\[\\s*\]`);
      console.log({ modifiedCode, regExp });
      expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it('removes first element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
        expect(modifiedCode.includes(`'a'`)).toBeFalsy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at middle of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            index: 1,
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeFalsy();
      });
    });

    context('last pos', () => {
      it('removes last element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            index: 'last',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'b','c'`)).toBeTruthy();
      });
    });

    context('last pos - before', () => {
      it('remove all props before last', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            relative: 'before',
            index: 'last',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeFalsy();
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
      });
    });

    context('last pos - after', () => {
      it('no remove', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            relative: 'after',
            index: 'last',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
      });
    });

    context('first pos', () => {
      it('removes first prop of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            index: 'first',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeFalsy();
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
      });
    });

    context('first pos - after', () => {
      it('remove all props after first', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            relative: 'after',
            index: 'first',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeFalsy();
      });
    });

    context('first pos - before', () => {
      it('no remove', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            relative: 'before',
            index: 'first',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
      });
    });

    context('between', () => {
      it.only('remove middle 2 elements', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-4-elements.txt',
        );
        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            between: {
              startPos: 1,
              endPos: 2,
            },
          },
        });
        const modifiedCode = code ? code : '';
        console.log({ modifiedCode });
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeFalsy();
        expect(modifiedCode.includes(`'c'`)).toBeFalsy();
        expect(modifiedCode.includes(`'d'`)).toBeTruthy();
      });
    });

    context('after a string literal', () => {
      it('remove b element after a string literal', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );

        const code = removeFromNamedArrayInFile(filePath, {
          varId: 'myNamedList',
          remove: {
            relative: 'after',
            findElement: (node: Node) => findStringLiteral(node, 'a'),
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeFalsy();
      });
    });
  });
});
