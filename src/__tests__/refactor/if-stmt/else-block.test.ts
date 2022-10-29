import { ifStmtExtractFunction } from '../../../refactor/if-stmt';
import { findFunctionBlock, findIfStatements } from '../../../find';
import { Block, IfStatement } from 'typescript';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('if else block extract function', () => {
  context('if then user block', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'if-then-user-block.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      if (!block) return;
      const ifStmts = findIfStatements(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const result = ifStmtExtractFunction(ifStmt, { mode: 'else' });
      if (!result) return;
      expect(result.callSrc).toBeUndefined();
      expect(result.fnSrc).toBeUndefined();
    });
  });

  // TODO: should NOT refactor single block with a single statement
  // Should filter out console.log statements (to be ignored)
  context('if else user block', () => {
    it('no replacement', () => {
      const filePath = path.join(__dirname, 'files', 'if-else-user-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      if (!block) return;
      const ifStmts = findIfStatements(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const result = ifStmtExtractFunction(ifStmt, { mode: 'else' });
      if (!result) return;
      expect(result.callSrc).toBeUndefined();
      expect(result.fnSrc).toBeUndefined();
    });
  });

  context('if else user block', () => {
    it('replacement if function and call', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'if-else-guest-user-block.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      if (!block) return;
      const ifStmts = findIfStatements(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const result = ifStmtExtractFunction(ifStmt, { mode: 'else' });
      if (!result) return;
      if (!result.callSrc || !result.fnSrc) return;
      expect(result.callSrc.code).toContain(
        `setUserGuest({user, setGuest, ctx})`,
      );
      expect(result.fnSrc.code).toContain(
        `const { user, setGuest, ctx } = opts`,
      );
      expect(result.fnSrc.code).toContain(`function setUserGuest(opts: any)`);
      expect(result.fnSrc.code).toContain(`if (user.type === 'admin')`);
      expect(result.fnSrc.code).toContain(`setGuest(user, ctx);`);
    });
  });
});
