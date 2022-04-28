import { findFirstConditionalExpression } from './../../find/find';
import { decomposeConditionalExpr } from './../../refactor/decompose-conditional';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('decompose conditional', () => {
  context('if else user block', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(__dirname, 'files', 'if-else-user-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const expr = findFirstConditionalExpression(srcNode);
      if (!expr) return;
      const result = decomposeConditionalExpr(expr, {});
      expect(result.callSrc).toEqual(`userTypeIsAdmin({user})`);
      expect(result.fnSrc).toContain(`function userTypeIsAdmin(opts: any)`);
      expect(result.fnSrc).toContain(`const { user } = opts`);
      expect(result.fnSrc).toContain(`return user.type === 'admin'`);
    });
  });
});
