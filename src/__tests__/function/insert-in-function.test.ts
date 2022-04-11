import { findVariableDeclaration } from './../../find';
import { insertInsideFunctionBlockInFile } from '../..';
import * as path from 'path';
import { findStringLiteral } from '../../find';
import { Node } from 'typescript';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert function', () => {
  context('file with no named function', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-function.txt');
      const codeToInsert = `let c = 2`;
      const inserted = insertInsideFunctionBlockInFile(filePath, {
        codeToInsert,
        id: 'myFun',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file with non-matching named function', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-function.txt',
      );
      const codeToInsert = `let c = 2`;
      const inserted = insertInsideFunctionBlockInFile(filePath, {
        codeToInsert,
        id: 'myFun',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = `const x = 2;`;
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file with named empty function', () => {
    it('inserts in start of function', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-function.txt',
      );
      const codeToInsert = `let c = 2`;
      const inserted = insertInsideFunctionBlockInFile(filePath, {
        codeToInsert,
        id: 'myFun',
      });
      const origCode = `const x = 2;`;
      const insertedTxt = inserted ? inserted : '';
      const str = `{\\s*${escapeRegExp(codeToInsert + ';')}\\s*`;
      const regExp = new RegExp(str);
      console.log({ insertedTxt });
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.match(regExp)).toBeTruthy();
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
        const codeToInsert = `let c = 2`;
        const inserted = insertInsideFunctionBlockInFile(filePath, {
          codeToInsert,
          id: 'myFun',
        });
        const origCode = `const x = 2;`;
        const insertedTxt = inserted ? inserted : '';
        const str = `{\\s*${escapeRegExp(codeToInsert + ';')}\\s*`;
        const regExp = new RegExp(str);
        expect(insertedTxt.includes(origCode)).toBeTruthy();
        expect(insertedTxt.match(regExp)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at statement position in function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const codeToInsert = `let c = 2`;
        const inserted = insertInsideFunctionBlockInFile(filePath, {
          codeToInsert,
          id: 'myFun',
          insert: {
            index: 1,
          },
        });
        const origCode = `const x = 2;`;
        const insertedTxt = inserted ? inserted : '';
        const str = `\\s*${escapeRegExp(codeToInsert + ';')}\\s*let b = 5;`;
        const regExp = new RegExp(str);
        expect(insertedTxt.includes(origCode)).toBeTruthy();
        expect(insertedTxt.match(regExp)).toBeTruthy();
      });
    });

    context('end pos', () => {
      it('inserts at end of function', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );
        const codeToInsert = `let c = 2`;
        const inserted = insertInsideFunctionBlockInFile(filePath, {
          codeToInsert,
          id: 'myFun',
          insert: {
            index: 'end',
          },
        });
        const origCode = `const x = 2;`;
        const insertedTxt = inserted ? inserted : '';
        const str = `\\s*${escapeRegExp(codeToInsert + ';')}\\s*}`;
        const regExp = new RegExp(str);
        expect(insertedTxt.includes(origCode)).toBeTruthy();
        expect(insertedTxt.match(regExp)).toBeTruthy();
      });
    });

    context('find specific statement for insertion', () => {
      it('inserts after specific statement', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-function-with-statements.txt',
        );

        const codeToInsert = `let c = 2`;
        const inserted = insertInsideFunctionBlockInFile(filePath, {
          codeToInsert,
          id: 'myFun',
          insert: {
            relative: 'after',
            findElement: (node: Node) => findVariableDeclaration(node, 'b'),
          },
        });
        const origCode = `const x = 2;`;
        const insertedTxt = inserted ? inserted : '';
        const str = `let b = 5;\\s*${escapeRegExp(codeToInsert + ';')}`;
        const regExp = new RegExp(str);
        expect(insertedTxt.includes(origCode)).toBeTruthy();
        expect(insertedTxt.match(regExp)).toBeTruthy();
      });
    });
  });
});
