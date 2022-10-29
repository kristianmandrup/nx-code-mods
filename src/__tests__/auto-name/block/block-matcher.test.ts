import { BlockMatcher } from './../../../auto-name/block/block-matcher';
import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Block } from 'typescript';
import { findFunctionBlock } from '../../../find';
import { createBlockMatcher } from '../../../auto-name';
import { arrayContains } from '../../utils';

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
        arrayContains(ids, ['user', 'ctx', 'ctx', 'user', 'setAdmin']);
      });
    });

    describe('verbs', () => {
      it('set', () => {
        const verbs = matcher.verbs;
        arrayContains(verbs, ['set']);
      });
    });

    describe('nouns', () => {
      it('type, set', () => {
        const nouns = matcher.nouns;
        expect(nouns).toEqual(['admin', 'user', 'ctx']);
      });
    });

    describe('unmatched', () => {
      it('empty', () => {
        const unmatched = matcher.unmatchedWords;
        expect(unmatched).toEqual([]);
      });
    });

    describe('matched', () => {
      it('empty', () => {
        const matched = matcher.matchedWords;
        expect(matched).toEqual(['set', 'admin', 'user', 'ctx']);
      });
    });

    describe('idRankMap', () => {
      let idRankMap: any, user: any;
      beforeEach(() => {
        idRankMap = matcher.idRankMap;
        user = idRankMap.user;
      });

      it('user: has count 2', () => {
        expect(user.count).toEqual(2);
      });

      it('user: has indexList 0,1', () => {
        expect(user.indexList).toEqual([0, 1]);
      });

      it('user: has rank 2.5', () => {
        expect(user.rank).toEqual(2.5);
      });
    });

    describe('ranked', () => {
      let ranked: any, nouns: any;
      beforeEach(() => {
        ranked = matcher.ranked;
        nouns = ranked.nouns;
      });

      it('nouns: ordered by rank', () => {
        expect(nouns).toEqual(['admin', 'user', 'ctx']);
      });
    });
  });
});
