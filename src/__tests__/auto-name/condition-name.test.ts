import { findIfStatementsWithElseBlocks } from '../../find/find';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findFunctionBlock } from '../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { conditionName } from '../../auto-name';
import { Block, IfStatement } from 'typescript';

const context = describe;

describe('condition name', () => {
  context('file with no named object', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'if-else-user-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const ifElseStmts = findIfStatementsWithElseBlocks(block);
      if (!ifElseStmts) return;
      const ifElseStmt = ifElseStmts[0] as IfStatement;
      const expression = ifElseStmt.expression;
      if (!expression) return;
      const name = conditionName(expression);
      expect(name).toEqual('userTypeIsAdmin');
    });
  });
});
