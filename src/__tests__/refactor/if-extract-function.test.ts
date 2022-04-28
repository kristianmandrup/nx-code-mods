import { ifThenStmtExtractFunction } from '../../refactor/if-extract-function';
import { Block, IfStatement } from 'typescript';
import { findFunctionBlock, findIfStatements } from '../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('if extract function', () => {
  context('if else user block', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(__dirname, 'files', 'if-else-user-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      if (!block) return;
      const ifStmts = findIfStatements(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const result = ifThenStmtExtractFunction(ifStmt, {});
      if (!result) return;
      expect(result.callSrc).toContain(
        `return setAdminByUser({user, setAdmin, ctx})`,
      );
      expect(result.fnSrc).toContain(`const { user, setAdmin, ctx } = opts`);
      expect(result.fnSrc).toContain(`function setAdminByUser(opts: any)`);
      expect(result.fnSrc).toContain(`if (!(user.type === 'admin'))`);
      expect(result.fnSrc).toContain(`setAdmin(user, ctx);`);
    });
  });

  context('if else using imports', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(
        __dirname,
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
      const result = ifThenStmtExtractFunction(ifStmt, {});
      if (!result) return;
      expect(result.callSrc).toContain(`return setAdminByUser({user, ctx})`);
      expect(result.fnSrc).toContain(`const { user, ctx } = opts`);
      expect(result.fnSrc).toContain(`function setAdminByUser(opts: any)`);
      expect(result.fnSrc).toContain(`if (!(user.type === 'admin'))`);
      expect(result.fnSrc).toContain(`setAdmin(user, ctx);`);
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
      const result = ifThenStmtExtractFunction(ifStmt, {});
      if (!result) return;
      expect(result.callSrc).toContain(`return setAdminByUser({user, ctx})`);
      expect(result.fnSrc).toContain(`const { user, ctx } = opts`);
      expect(result.fnSrc).toContain(`function setAdminByUser(opts: any)`);
      expect(result.fnSrc).toContain(`if (!(user.type === 'admin'))`);
      expect(result.fnSrc).toContain(`setAdmin(user, ctx);`);
    });
  });
});
