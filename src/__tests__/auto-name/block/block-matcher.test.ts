import { BlockMatcher } from './../../../auto-name/block/block-matcher';
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

    let matcher: BlockMatcher;
    beforeEach(() => {
      matcher = createBlockMatcher(block);
    });

    describe('ids', () => {
      it('set, admin, user, ctx', () => {
        const ids = matcher.ids;
        expect(ids).toContain(['setAdmin', 'user', 'ctx', 'ctx', 'user']);
      });
    });

    describe('verbs', () => {
      it('set', () => {
        const verbs = matcher.verbs;
        expect(verbs).toContain(['set']);
      });
    });

    describe('nouns', () => {
      it('type, set', () => {
        const nouns = matcher.nouns;
        expect(nouns).toContain(['set', 'admin', 'user', 'ctx']);
      });
    });

    describe('unmatched', () => {
      it('empty', () => {
        const unmatched = matcher.unmatchedIds;
        expect(unmatched).toEqual(['setAdmin']);
      });
    });

    describe('matched', () => {
      it('empty', () => {
        const matched = matcher.matchedIds;
        expect(matched).toEqual(['set', 'admin', 'user', 'ctx']);
      });
    });

    describe('idRankMap', () => {
      let idRankMap: any, user: any;
      beforeEach(() => {
        idRankMap = matcher.idRankMap;
        user = idRankMap.user;
        console.log({ idRankMap, user });
      });

      it('user: has count 4', () => {
        expect(user.count).toEqual(2);
      });

      it('user: has indexList 0,1', () => {
        expect(user.rank).toEqual(2.5);
      });

      it('user: has rank 2.5', () => {
        expect(user.rank).toEqual(2.5);
      });
    });

    describe.only('ranked', () => {
      let ranked: any, nouns: any;
      beforeEach(() => {
        ranked = matcher.ranked;
        nouns = ranked.nouns;
      });

      it('nouns: ordered by rank', () => {
        expect(nouns).toEqual(['set', 'admin', 'user', 'ctx']);
      });
    });
  });
});
