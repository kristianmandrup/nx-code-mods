import { findIfStatementsWithoutElseBlocks } from '../../../find';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findFunctionBlock } from '../../../find';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { createStmtMatcher } from '../../../auto-name';
import { Block, IfStatement } from 'typescript';

const context = describe;

describe('statement matcher', () => {
  context('user type is admin', () => {
    const filePath = path.join(__dirname, 'files', 'binary-expr-is.txt');
    const content = readFileIfExisting(filePath);
    const srcNode = tsquery.ast(content);
    const block = findFunctionBlock(srcNode, 'xyz') as Block;
    const ifStmts = findIfStatementsWithoutElseBlocks(block);
    if (!ifStmts) return;
    const ifStmt = ifStmts[0] as IfStatement;
    const matcher = createStmtMatcher(ifStmt, 0);

    describe('ids', () => {
      it('user, type, admin', () => {
        const ids = matcher.ids;
        expect(ids).toEqual(['user', 'type', 'admin']);
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
        expect(verbs).toEqual([]);
      });
    });

    describe('nouns', () => {
      it('empty', () => {
        const nouns = matcher.nouns;
        expect(nouns).toEqual(['user', 'type', 'admin']);
      });
    });

    describe('prepositions', () => {
      it('empty', () => {
        const prepositions = matcher.prepositions;
        expect(prepositions).toEqual([]);
      });
    });

    describe('matchedIds', () => {
      it('empty', () => {
        const matched = matcher.matchedWords;
        expect(matched).toEqual(['user', 'type', 'admin']);
      });
    });

    describe('unmatchedIds', () => {
      it('empty', () => {
        const unmatched = matcher.unmatchedWords;
        expect(unmatched).toEqual([]);
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
