import { findVariableDeclaration } from '../../find';
import { insertInsideFunctionBlockInFile } from '../..';
import * as path from 'path';
import { Node } from 'typescript';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert function', () => {
  context('file with no named function', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-function.txt');
      const code = insertInsideFunctionBlockInFile(filePath, {
        code: `let c = 2`,
        functionId: 'myFun',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(code)).toBeFalsy();
    });
  });

  context('file with non-matching named function', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-function.txt',
      );
      const code = insertInsideFunctionBlockInFile(filePath, {
        code: `let c = 2`,
        functionId: 'myFun',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const x = 2;`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(code)).toBeFalsy();
    });
  });

  context('file with named empty function', () => {
    it('inserts in start of function', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-function.txt',
      );
      const code = insertInsideFunctionBlockInFile(filePath, {
        code: `let c = 2`,
        functionId: 'myFun',
      });
      const origCode = `const x = 2;`;
      const modifiedCode = code ? code : '';
      const str = `{\\s*${escapeRegExp(code + ';')}\\s*`;
      const regExp = new RegExp(str);
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file with named function with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = insertInsideFunctionBlockInFile(filePath, {
          code: `let c = 2`,
          functionId: 'myFun',
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        const str = `{\\s*${escapeRegExp(code + ';')}\\s*`;
        const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at statement position in function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = insertInsideFunctionBlockInFile(filePath, {
          code: `let c = 2`,
          functionId: 'myFun',
          insert: {
            index: 1,
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        const str = `\\s*${escapeRegExp(code + ';')}\\s*let b = 5;`;
        const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('end pos', () => {
      it('inserts at end of function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = insertInsideFunctionBlockInFile(filePath, {
          code: `let c = 2`,
          functionId: 'myFun',
          insert: {
            index: 'end',
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        const str = `\\s*${escapeRegExp(code + ';')}\\s*}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('find specific statement for insertion', () => {
      it('inserts after specific statement', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const code = insertInsideFunctionBlockInFile(filePath, {
          code: `let c = 2`,
          functionId: 'myFun',
          insert: {
            relative: 'after',
            findElement: (node: Node) => findVariableDeclaration(node, 'b'),
          },
        });
        const origCode = `const x = 2;`;
        const modifiedCode = code ? code : '';
        const str = `let b = 5;\\s*${escapeRegExp(code + ';')}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.includes(origCode)).toBeTruthy();
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });
  });
});
