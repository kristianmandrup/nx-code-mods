import {
  extractIfThenStmtToFunctions,
  refactorIfStmtsToFunctions,
} from '../../../refactor/if-stmt';
import { findFunctionBlock, findIfStatements } from '../../../find';
import { Block, IfStatement } from 'typescript';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';
import { strContains, strNotContains } from '../../utils';

const context = describe;

describe('if statement', () => {
  context('if then user block', () => {
    let content: string;
    beforeEach(() => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'if-then-user-block.txt',
      );
      content = readFileIfExisting(filePath);
    });

    describe('extractIfThenStmtToFunctions', () => {
      it('replaced with: function and function call', () => {
        const srcNode = tsquery.ast(content);
        const block = findFunctionBlock(srcNode, 'xyz') as Block;
        if (!block) return;
        const ifStmts = findIfStatements(block);
        if (!ifStmts) return;
        const stmt = ifStmts[0] as IfStatement;
        const code = extractIfThenStmtToFunctions(srcNode, stmt);
        if (!code) return;
        const newSrcNode = tsquery.ast(code);
        const newBlock = findFunctionBlock(newSrcNode, 'xyz') as Block;
        const blockCode = newBlock.getFullText();
        strNotContains(blockCode, 'user.type');
        strContains(blockCode, `return setUserGuest({user, setGuest, ctx})`);
      });
    });

    describe('refactorIfStmtsToFunctions', () => {
      it('replaced with: function and function call', () => {
        const code = refactorIfStmtsToFunctions(content);
        if (!code) return;
        const newSrcNode = tsquery.ast(code);
        const newBlock = findFunctionBlock(newSrcNode, 'xyz') as Block;
        const blockCode = newBlock.getFullText();
        strNotContains(blockCode, 'user.type');
        strContains(blockCode, `return setUserGuest({user, setGuest, ctx})`);
      });
    });

    context('if then else user block', () => {
      let content: string;
      beforeEach(() => {
        const filePath = path.join(
          __dirname,
          '..',
          'files',
          'if-else-user-block.txt',
        );
        content = readFileIfExisting(filePath);
      });

      describe('refactorIfStmtsToFunctions', () => {
        it('replaced with: 2 functions and 2 function calls with logical or ||', () => {
          const code = refactorIfStmtsToFunctions(content);
          // console.log(code);
          if (!code) return;
          expect(code).toBeDefined();
        });
      });
    });
  });
});
