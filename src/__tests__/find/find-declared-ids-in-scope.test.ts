import { idToStr } from '../../auto-name/utils';
import {
  findIfStatements,
  findIfStatementThenBlock,
  findDeclaredIdentifiersInScope,
} from '../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('find ids in parent scopes', () => {
  context('if else user block', () => {
    it('only xyz function in parent scopes', () => {
      const filePath = path.join(__dirname, 'files', 'if-else-user-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const ifStmts = findIfStatements(srcNode);
      if (!ifStmts) return;
      const firstIf = ifStmts[0];
      const thenBlock = findIfStatementThenBlock(firstIf);
      const result = findDeclaredIdentifiersInScope(thenBlock);
      const ids = result.map(idToStr);
      expect(ids).toContain(['xyc']);
    });
  });
});
