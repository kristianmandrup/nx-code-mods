import { ifStmtExtractFunction } from '../../../refactor/if-stmt/common';
import { findFunctionBlock, findIfStatements } from '../../../find';
import { Block, IfStatement } from 'typescript';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('if extract function', () => {
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
      const result = ifStmtExtractFunction(ifStmt, { mode: 'then' });
      if (!result) return;
      if (!result.callSrc || !result.fnSrc) return;
      expect(result.callSrc.code).toContain(
        `setUserGuest({user, setGuest, ctx})`,
      );
      expect(result.fnSrc.code).toContain(
        `const { user, setGuest, ctx } = opts`,
      );
      expect(result.fnSrc.code).toContain(`function setUserGuest(opts: any)`);
      expect(result.fnSrc.code).toContain(`if (!(user.type === 'guest'))`);
      expect(result.fnSrc.code).toContain(`setGuest(user, ctx);`);
    });
  });

  context('if else user block', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'if-else-user-block.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      if (!block) return;
      const ifStmts = findIfStatements(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const result = ifStmtExtractFunction(ifStmt, { mode: 'then' });
      if (!result) return;
      if (!result.callSrc || !result.fnSrc) return;
      expect(result.callSrc.code).toContain(
        `setUserAdmin({user, setAdmin, ctx})`,
      );
      expect(result.fnSrc.code).toContain(
        `const { user, setAdmin, ctx } = opts`,
      );
      expect(result.fnSrc.code).toContain(`function setUserAdmin(opts: any)`);
      expect(result.fnSrc.code).toContain(`if (!(user.type === 'admin'))`);
      expect(result.fnSrc.code).toContain(`setAdmin(user, ctx);`);
    });
  });

  context('if else using imports', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'if-else-using-imports.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      if (!block) return;
      const ifStmts = findIfStatements(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const result = ifStmtExtractFunction(ifStmt, { mode: 'then' });
      if (!result) return;
      if (!result.callSrc || !result.fnSrc) return;
      expect(result.callSrc.code).toContain(`return setUserAdmin({user, ctx})`);
      expect(result.fnSrc.code).toContain(`const { user, ctx } = opts`);
      expect(result.fnSrc.code).toContain(`function setUserAdmin(opts: any)`);
      expect(result.fnSrc.code).toContain(`if (!(user.type === 'admin'))`);
      expect(result.fnSrc.code).toContain(`setAdmin(user, ctx);`);
    });
  });

  context('if else using top lv ids', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'if-else-using-top-lv-ids.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      if (!block) return;
      const ifStmts = findIfStatements(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const result = ifStmtExtractFunction(ifStmt, { mode: 'then' });
      if (!result) return;
      if (!result.callSrc || !result.fnSrc) return;
      expect(result.callSrc.code).toContain(`return setUserAdmin({user, ctx})`);
      expect(result.fnSrc.code).toContain(`const { user, ctx } = opts`);
      expect(result.fnSrc.code).toContain(`function setUserAdmin(opts: any)`);
      expect(result.fnSrc.code).toContain(`if (!(user.type === 'admin'))`);
      expect(result.fnSrc.code).toContain(`setAdmin(user, ctx);`);
    });
  });
});
