import { tsquery } from '@phenomnomnominal/tsquery';
import { findFunctionBlock } from './../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { stmtBlockToName } from '../../refactor';
import { Block } from 'typescript';

const context = describe;

describe('stmtBlockToName', () => {
  context('file with no named object', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'user-find-block.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const name = stmtBlockToName(block);
      expect(name).toEqual('findUserByType');
    });
  });
});
