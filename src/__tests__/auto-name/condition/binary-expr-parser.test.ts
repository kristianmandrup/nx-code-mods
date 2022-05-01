import * as path from 'path';
import { Block, IfStatement } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import {
  findFunctionBlock,
  findBinaryExpressions,
  findIfStatements,
} from '../../../find';
import {
  BinaryExpressionParser,
  createBinaryExpressionParser,
} from '../../../auto-name';

const context = describe;

describe('binary expression parser', () => {
  context('binary expression is', () => {
    let parser: BinaryExpressionParser;

    beforeAll(() => {
      const filePath = path.join(__dirname, 'files', 'binary-expr-is.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const ifElseStmts = findIfStatements(block);
      if (!ifElseStmts || ifElseStmts.length === 0) return;
      const ifElseStmt = ifElseStmts[0] as IfStatement;
      if (!ifElseStmt) return;
      const exprs = findBinaryExpressions(ifElseStmt);
      const binExpr = exprs[0];
      if (!binExpr) return;
      parser = createBinaryExpressionParser(binExpr);
    });

    describe('leftIds', () => {
      it('user, type', () => {
        const ids = parser.leftIds;
        expect(ids).toEqual(['user', 'type']);
      });
    });

    describe('rightIds', () => {
      it('admin', () => {
        const ids = parser.rightIds;
        expect(ids).toEqual(['admin']);
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
