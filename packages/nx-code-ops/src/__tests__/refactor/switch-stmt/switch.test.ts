import { findFunctionBlock, findReferenceIdentifiersFor } from '../../../find';
import { Block } from 'typescript';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';
import { extractSwitchStatements } from '../../../refactor';

const context = describe;

describe('extract methods from switch', () => {
  context('switch stmt', () => {
    it('replaced with: functions and function calls', () => {
      const filePath = path.join(__dirname, '..', 'files', 'switch.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const code = extractSwitchStatements(srcNode, block);
      expect(code).toContain(`function isTypeA({type})`);
      expect(code).toContain(`function isTypeB({type})`);
      expect(code).toContain(`function isTypeDefault()`);
      expect(code).toContain(
        `isTypeA({type}) || isTypeB({type}) || isTypeDefault()`,
      );
    });
  });
});
