import { replaceInNamedArrayInFile } from '../..';
import * as path from 'path';
import { findStringLiteral } from '../../find';
import { Node } from 'typescript';

const context = describe;

describe('replace from array', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const code = replaceInNamedArrayInFile(filePath, {
        code: `'xx'`,
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(`'xx'`)).toBeFalsy();
    });
  });

  context('file with non-matching named array', () => {
    it('no replace', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-array.txt',
      );
      const code = replaceInNamedArrayInFile(filePath, {
        code: `'xx'`,
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const anotherList = ['a','b']`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // expect(modifiedCode.includes(code)).toBeFalsy();
    });
  });

  context('file with named empty array', () => {
    it.skip('no replace', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-array.txt',
      );
      const code = replaceInNamedArrayInFile(filePath, {
        code: `'xx'`,
        varId: 'myNamedList',
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`const myNamedList = []`)).toBeTruthy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it.skip('replaces first element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
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
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
            index: 1,
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeFalsy();
      });
    });

    context('last pos', () => {
      it('replaces last element of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
            index: 'last',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'b','c'`)).toBeTruthy();
      });
    });

    context('last pos - before', () => {
      it('replace all props before last', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
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
      it('no replace', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
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
      it('replaces first prop of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
            index: 'first',
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeFalsy();
        expect(modifiedCode.includes(`'b'`)).toBeTruthy();
      });
    });

    context('first pos - after', () => {
      it('replace all props after first', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
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
      it('no replace', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
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
      it('replace middle 2 elements', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-4-elements.txt',
        );
        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
            between: {
              startPos: 1,
              endPos: 2,
            },
          },
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeFalsy();
        expect(modifiedCode.includes(`'c'`)).toBeFalsy();
        expect(modifiedCode.includes(`'d'`)).toBeTruthy();
      });
    });

    context('after b string literal', () => {
      it('replace after b string literal', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );

        const code = replaceInNamedArrayInFile(filePath, {
          code: `'xx'`,
          varId: 'myNamedList',
          replace: {
            relative: 'after',
            findElement: (node: Node) => findStringLiteral(node, 'a'),
          },
        });
        const modifiedCode = code ? code : '';
        console.log({ modifiedCode });
        expect(modifiedCode.includes(`'a'`)).toBeTruthy();
        expect(modifiedCode.includes(`'b'`)).toBeFalsy();
      });
    });
  });
});
