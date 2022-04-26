import { tsquery } from '@phenomnomnominal/tsquery';
import { findFunctionBlock } from '../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { blockName } from '../../auto-name';
import { Block } from 'typescript';

const context = describe;

describe('block name', () => {
  context('file with no named object', () => {
    it('determines sensible name', () => {
      const filePath = path.join(__dirname, 'files', 'user-find-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const name = blockName(block);
      expect(name).toEqual('findUserWhereType');
    });
  });
});
