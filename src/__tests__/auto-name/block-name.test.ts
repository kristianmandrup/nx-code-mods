import { tsquery } from '@phenomnomnominal/tsquery';
import { findFunctionBlock } from '../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { blockName } from '../../auto-name';
import { Block } from 'typescript';

const context = describe;

describe('block name', () => {
  context('user find in last statement', () => {
    it('determines sensible name', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'user-find-last-statement.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const name = blockName(block);
      expect(name).toEqual('findUserWhereType');
    });
  });

  context('return user in last statement', () => {
    it('determines sensible name', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'user-find-return-user.txt',
      );
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const name = blockName(block);
      expect(name).toEqual('findUserWhere');
    });
  });

  context('return user or default', () => {
    it('determines sensible name', () => {
      const filePath = path.join(__dirname, 'files', 'user-find-default.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const name = blockName(block);
      expect(name).toEqual('findUserWhere');
    });
  });

  context('users sort', () => {
    it('determines sensible name', () => {
      const filePath = path.join(__dirname, 'files', 'users-sort.txt');
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      const name = blockName(block);
      console.log({ name });
      expect(name).toEqual('sortedUsersBy');
    });
  });
});
