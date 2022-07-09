import { findIfStatementsWithoutElseBlocks } from './../../../find/conditional/conditional';
import { findBinaryExpressions } from '../../../find';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findFunctionBlock } from '../../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { conditionName } from '../../../auto-name';
import { Block, IfStatement, BinaryExpression } from 'typescript';

const context = describe;

describe('condition name', () => {
  context('user type is admin', () => {
    it('name: userTypeIsAdmin', () => {
      const filePath = path.join(__dirname, 'files', 'binary-expr-is.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const ifStmts = findIfStatementsWithoutElseBlocks(block);
      if (!ifStmts) return;
      const ifStmt = ifStmts[0] as IfStatement;
      const expression = ifStmt.expression;
      if (!expression) return;
      const name = conditionName(expression);
      expect(name).toEqual('userTypeIsAdmin');
    });
  });

  context('user sort by level', () => {
    it('name: userLevel', () => {
      const filePath = path.join(__dirname, 'files', 'users-sort.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const exprs = findBinaryExpressions(block);
      if (!exprs) return;
      const expression = exprs[0] as BinaryExpression;
      if (!expression) return;
      const name = conditionName(expression);
      expect(name).toEqual('userLevel');
    });
  });
});
