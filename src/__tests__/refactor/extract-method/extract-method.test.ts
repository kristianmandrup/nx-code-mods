import { findFunctionBlock, findReferenceIdentifiersFor } from '../../../find';
import { Block } from 'typescript';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';
import { extractMethods } from '../../../refactor';

const context = describe;

describe('extract method', () => {
  context('function blocks', () => {
    it('replaced with: functions and function calls', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'extract-method.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const code = extractMethods(srcNode, block);
      expect(code).toContain(`function namePrint({name, print})`);
      expect(code).toContain(`function printItem({items, print, item})`);
      expect(code).toContain(`function pushRest({items})`);
      expect(code).toContain(`namePrint({name, print})`);
      expect(code).toContain(`printItem({items, print, item})`);
      expect(code).toContain(`pushRest({items})`);
    });
  });
});
