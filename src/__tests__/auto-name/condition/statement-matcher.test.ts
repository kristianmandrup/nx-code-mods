import { findIfStatementsWithElseBlocks } from '../../../find';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findFunctionBlock } from '../../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { createStmtMatcher } from '../../../auto-name';
import { Block, IfStatement } from 'typescript';

const context = describe;

describe('statement matcher', () => {
  context('if else user block', () => {
    const filePath = path.join(__dirname, 'files', 'user-type-is-admin.txt');
    const content = readFileIfExisting(filePath);
    const srcNode = tsquery.ast(content);
    const block = findFunctionBlock(srcNode, 'xyz') as Block;
    const ifElseStmts = findIfStatementsWithElseBlocks(block);
    if (!ifElseStmts || ifElseStmts.length === 0) return;
    const ifElseStmt = ifElseStmts[0] as IfStatement;
    if (!ifElseStmt) return;
    const matcher = createStmtMatcher(ifElseStmt, 0);

    describe('ids', () => {
      it('user, type, admin', () => {
        const ids = matcher.ids;
        expect(ids).toContain(['user', 'type', 'admin']);
      });
    });

    describe('adjectives', () => {
      it('empty', () => {
        const adjectives = matcher.adjectives;
        expect(adjectives).toEqual([]);
      });
    });

    describe('verbs', () => {
      it('type', () => {
        const verbs = matcher.verbs;
        expect(verbs).toEqual(['type']);
      });
    });

    describe('nouns', () => {
      it('empty', () => {
        const nouns = matcher.nouns;
        expect(nouns).toContain(['user', 'type', 'admin']);
      });
    });

    describe('prepositions', () => {
      it('empty', () => {
        const prepositions = matcher.prepositions;
        expect(prepositions).toContain([]);
      });
    });

    describe('matchedIds', () => {
      it('empty', () => {
        const matchedIds = matcher.matchedIds;
        expect(matchedIds).toContain(['user', 'type', 'admin']);
      });
    });

    describe('unmatchedIds', () => {
      it('empty', () => {
        const unmatchedIds = matcher.unmatchedIds;
        expect(unmatchedIds).toContain([]);
      });
    });

    describe('idCountMap', () => {
      it('name: userTypeIsAdmin', () => {
        const idCountMap = matcher.idCountMap;
        expect(idCountMap.user).toEqual(1);
      });
    });
  });
});
