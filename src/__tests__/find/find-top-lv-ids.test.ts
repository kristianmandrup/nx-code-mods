import { findTopLevelIdentifiers } from './../../find/find';
import { idToStr } from '../../auto-name/utils';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('find id declarations in top lv scope of file', () => {
  context('if else user block', () => {
    it('only xyz function in parent scopes', () => {
      const filePath = path.join(__dirname, 'files', 'if-else-user-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const result = findTopLevelIdentifiers(srcNode);
      const ids = result.map(idToStr);
      expect(ids).toContain(['xyc']);
    });
  });
});
