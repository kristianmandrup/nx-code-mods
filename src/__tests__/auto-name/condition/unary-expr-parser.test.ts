import * as path from 'path';
import { Block, IfStatement } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import {
  findFunctionBlock,
  findIfStatementsWithElseBlocks,
  findPrefixUnaryExpressions,
} from '../../../find';
import { createUnaryExpressionParser } from '../../../auto-name';

const context = describe;

describe('unary expression parser', () => {
  context('unary expr: not', () => {
    const filePath = path.join(__dirname, 'files', 'unary-expr-not.txt');
    const content = readFileIfExisting(filePath);
    const srcNode = tsquery.ast(content);
    const block = findFunctionBlock(srcNode, 'xyz') as Block;
    const ifElseStmts = findIfStatementsWithElseBlocks(block);
    if (!ifElseStmts || ifElseStmts.length === 0) return;
    const ifElseStmt = ifElseStmts[0] as IfStatement;
    if (!ifElseStmt) return;
    const exprs = findPrefixUnaryExpressions(ifElseStmt);
    const puExpr = exprs[0];
    if (!puExpr) return;
    const parser = createUnaryExpressionParser(puExpr);

    describe('ids', () => {
      it('user, type, admin', () => {
        const ids = parser.ids;
        expect(ids).toContain(['user', 'type', 'admin']);
      });
    });

    describe('operatorName', () => {
      it('not', () => {
        const name = parser.operatorName;
        expect(name).toEqual('not');
      });
    });
  });
});
