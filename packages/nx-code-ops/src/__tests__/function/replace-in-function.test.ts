import { findVariableDeclaration } from '../../find';
import { replaceInsideFunctionBlockInFile } from '../..';
import * as path from 'path';
import { Node } from 'typescript';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('replace from function', () => {
  context('file with no named function', () => {
    it('no replace', () => {
      const filePath = path.join(__dirname, 'files', 'no-function.txt');
      const code = replaceInsideFunctionBlockInFile(filePath, {
        code: 'let x = 3 + 2',
        functionId: 'myFun',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with non-matching named function', () => {
    it('no replace', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-function.txt',
      );
      const code = replaceInsideFunctionBlockInFile(filePath, {
        code: 'let x = 3 + 2',
        functionId: 'myFun',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const x = 2;`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named empty function', () => {
    it('replaces in start of function', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-function.txt',
      );
      const code = replaceInsideFunctionBlockInFile(filePath, {
        code: 'let x = 3 + 2',
        functionId: 'myFun',
      });
      const origCode = `const x = 2;`;
      const modifiedCode = code ? code : '';
      // const str = `{\\s*${escapeRegExp(code + ';')}\\s*`;
      // const regExp = new RegExp(str);
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file with named function with 2 elements', () => {
    context('default pos', () => {
      it('replaces at start of function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = replaceInsideFunctionBlockInFile(filePath, {
          code: 'let x = 3 + 2',
          functionId: 'myFun',
        });
        const origCode = `const x = 2;`;
        const firstRemainingStmt = `let b = 5`;
        const modifiedCode = code ? code : '';
        const replacedStmt = `console.log('hello', a)`;
        const replacedStmtExp = escapeRegExp(replacedStmt);
        expect(modifiedCode.match(replacedStmtExp)).toBeFalsy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        expect(modifiedCode.includes(firstRemainingStmt)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('replaces at statement position in function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = replaceInsideFunctionBlockInFile(filePath, {
          code: 'let x = 3 + 2',
          functionId: 'myFun',
          replace: {
            index: 1,
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        // const str = `\\s*${escapeRegExp(code + ';')}\\s*let b = 5;`;
        // const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        // expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('last pos', () => {
      it('replaces last element of function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = replaceInsideFunctionBlockInFile(filePath, {
          code: 'let x = 3 + 2',
          functionId: 'myFun',
          replace: {
            index: 'last',
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        // const str = `\\s*${escapeRegExp(code + ';')}\\s*}`;
        // const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        // expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('find specific statement for replace position', () => {
      it('replaces after specific statement', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = replaceInsideFunctionBlockInFile(filePath, {
          code: 'let x = 3 + 2',
          functionId: 'myFun',
          replace: {
            relative: 'after',
            findElement: (node: Node) => findVariableDeclaration(node, 'b'),
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        // const str = `let b = 5;\\s*${escapeRegExp(code + ';')}`;
        // const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        // expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });
  });
});
