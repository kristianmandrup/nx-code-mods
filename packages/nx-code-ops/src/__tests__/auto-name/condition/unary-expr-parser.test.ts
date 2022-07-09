import * as path from 'path';
import { Block, IfStatement, SyntaxKind } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import {
  findFunctionBlock,
  findIfStatements,
  findPrefixUnaryExpressions,
} from '../../../find';
import {
  createUnaryExpressionParser,
  UnaryExpressionParser,
} from '../../../auto-name';

const context = describe;

describe('unary expression parser', () => {
  context('unary expr: not', () => {
    let parser: UnaryExpressionParser;
    beforeAll(() => {
      const filePath = path.join(__dirname, 'files', 'unary-expr-not.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const ifElseStmts = findIfStatements(block);
      if (!ifElseStmts || ifElseStmts.length === 0) return;
      const ifElseStmt = ifElseStmts[0] as IfStatement;
      if (!ifElseStmt) return;
      const exprs = findPrefixUnaryExpressions(ifElseStmt);
      const puExpr = exprs[0];
      if (!puExpr) return;
      parser = createUnaryExpressionParser(puExpr);
    });

    describe('ids', () => {
      it('user, type', () => {
        const ids = parser.ids;
        expect(ids).toEqual(['user', 'type']);
      });
    });

    describe('operator', () => {
      it('!', () => {
        const op = parser.operator;
        expect(op).toEqual(String(SyntaxKind.ExclamationToken));
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
