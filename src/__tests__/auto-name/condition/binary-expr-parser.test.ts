import * as path from 'path';
import { Block, IfStatement } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import {
  findFunctionBlock,
  findBinaryExpressions,
  findIfStatementsWithElseBlocks,
} from '../../../find';
import { createBinaryExpressionParser } from '../../../auto-name';

const context = describe;

describe('binary expression parser', () => {
  context('binary expression is', () => {
    const filePath = path.join(__dirname, 'files', 'binary-expr-is.txt');
    const content = readFileIfExisting(filePath);
    const srcNode = tsquery.ast(content);
    const block = findFunctionBlock(srcNode, 'xyz') as Block;
    const ifElseStmts = findIfStatementsWithElseBlocks(block);
    if (!ifElseStmts || ifElseStmts.length === 0) return;
    const ifElseStmt = ifElseStmts[0] as IfStatement;
    if (!ifElseStmt) return;
    const exprs = findBinaryExpressions(ifElseStmt);
    const binExpr = exprs[0];
    if (!binExpr) return;
    const parser = createBinaryExpressionParser(binExpr);

    describe('leftIds', () => {
      it('user, type, admin', () => {
        const ids = parser.leftIds;
        expect(ids).toContain(['user', 'type', 'admin']);
      });
    });

    describe('rightIds', () => {
      it('user, type, admin', () => {
        const ids = parser.rightIds;
        expect(ids).toContain(['user', 'type', 'admin']);
      });
    });

    describe('tokenName', () => {
      it('is', () => {
        const name = parser.tokenName;
        expect(name).toEqual('is');
      });
    });
  });
});
