import {
  idToStr,
  findIfStatements,
  findIfStatementThenBlock,
  findLocalIdentifiersWithinScopePath,
} from '../../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('find id declarations in local block scope', () => {
  context('if else user block', () => {
    it('only xyz function in parent scopes', () => {
      const filePath = path.join(__dirname, 'files', 'if-else-user-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const ifStmts = findIfStatements(srcNode);
      if (!ifStmts) return;
      const firstIf = ifStmts[0];
      const thenBlock = findIfStatementThenBlock(firstIf);
      const result = findLocalIdentifiersWithinScopePath(thenBlock);
      const ids = result.map(idToStr);
      expect(ids).toContain(['ctx', 'v']);
    });
  });
});
