import { findVariableDeclaration } from '../../find';
import { removeInsideFunctionBlockInFile } from '../..';
import * as path from 'path';
import { Node } from 'typescript';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('remove from function', () => {
  context('file with no named function', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'no-function.txt');
      const code = removeInsideFunctionBlockInFile(filePath, {
        id: 'myFun',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with non-matching named function', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-function.txt',
      );
      const code = removeInsideFunctionBlockInFile(filePath, {
        id: 'myFun',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const x = 2;`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named empty function', () => {
    it('removes in start of function', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-function.txt',
      );
      const code = removeInsideFunctionBlockInFile(filePath, {
        id: 'myFun',
      });
      const origCode = `const x = 2;`;
      const modifiedCode = code ? code : '';
      // const str = `{\\s*${escapeRegExp(codeToInsert + ';')}\\s*`;
      // const regExp = new RegExp(str);
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file with named function with 2 elements', () => {
    context('default pos', () => {
      it('removes at start of function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = removeInsideFunctionBlockInFile(filePath, {
          id: 'myFun',
        });
        const origCode = `const x = 2;`;
        const firstRemainingStmt = `let b = 5`;
        const modifiedCode = code ? code : '';
        const removedStmt = `console.log('hello', a)`;
        const removedStmtExp = escapeRegExp(removedStmt);
        const remainStmtExp = `{\\s*${escapeRegExp(firstRemainingStmt)}`;
        console.log({ firstRemainingStmt, remainStmtExp, modifiedCode });
        expect(modifiedCode.match(removedStmtExp)).toBeFalsy();
        expect(modifiedCode.match(remainStmtExp)).toBeTruthy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        // expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it.skip('removes at statement position in function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = removeInsideFunctionBlockInFile(filePath, {
          id: 'myFun',
          remove: {
            index: 1,
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        // const str = `\\s*${escapeRegExp(codeToInsert + ';')}\\s*let b = 5;`;
        // const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        // expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('last pos', () => {
      it.skip('removes last element of function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = removeInsideFunctionBlockInFile(filePath, {
          id: 'myFun',
          remove: {
            index: 'last',
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        // const str = `\\s*${escapeRegExp(codeToInsert + ';')}\\s*}`;
        // const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        // expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('find specific statement for remove position', () => {
      it.skip('removes after specific statement', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = removeInsideFunctionBlockInFile(filePath, {
          id: 'myFun',
          remove: {
            relative: 'after',
            findElement: (node: Node) => findVariableDeclaration(node, 'b'),
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        // const str = `let b = 5;\\s*${escapeRegExp(codeToInsert + ';')}`;
        // const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        // expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });
  });
});
