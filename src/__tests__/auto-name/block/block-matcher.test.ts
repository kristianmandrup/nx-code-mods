import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Block } from 'typescript';
import { findFunctionBlock } from '../../../find';
import { createBlockMatcher } from '../../../auto-name';

const context = describe;

describe('block matcher', () => {
  context('block.txt', () => {
    const filePath = path.join(__dirname, 'files', 'block.txt');
    const content = readFileIfExisting(filePath);
    const srcNode = tsquery.ast(content);
    const block = findFunctionBlock(srcNode, 'xyz') as Block;
    if (!block) return;
    const matcher = createBlockMatcher(block);

    describe('ids', () => {
      it('user, type, admin', () => {
        const ids = matcher.ids;
        expect(ids).toContain(['ctx', 'set', 'guest', 'user', 'type', 'admin']);
      });
    });

    describe('verbs', () => {
      it('type, set', () => {
        const ids = matcher.ids;
        expect(ids).toContain(['type', 'set']);
      });
    });

    describe('nouns', () => {
      it('type, set', () => {
        const ids = matcher.ids;
        expect(ids).toContain(['ctx', 'guest', 'user', 'admin']);
      });
    });

    describe('unmatched', () => {
      it('empty', () => {
        const ids = matcher.ids;
        expect(ids).toContain([]);
      });
    });

    describe('idRankMap', () => {
      const idRankMap = matcher.idRankMap;
      const user = idRankMap.user;
      it('user: has count 4', () => {
        expect(user.count).toEqual(4);
      });

      it('user: has indexList 0,1', () => {
        expect(user.rank).toEqual(2.5);
      });

      it('user: has rank 2.5', () => {
        expect(user.rank).toEqual(2.5);
      });
    });

    describe('ranked', () => {
      const ranked = matcher.ranked;
      const nouns = ranked.nouns;
      it('user: has count 4', () => {
        expect(nouns).toEqual(['user', 'ctx', 'admin']);
      });
    });
  });
});
