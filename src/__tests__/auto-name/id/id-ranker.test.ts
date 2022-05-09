import { createStmtMatcher } from './../../../auto-name/block/statement-matcher';
import { idMatcher, createRanker } from '../../../auto-name';

const context = describe;

describe('id ranker', () => {
  context('find users by type', () => {
    const matcher = idMatcher('setAdminType');
    const ranker = createRanker(matcher);

    describe('rankIdLists', () => {
      it('puts ranked ids in idRankMap', () => {
        ranker.rankIdLists();
        expect(ranker.idRankMap).toEqual({});
      });
    });

    describe('byRank', () => {
      it('ranks by nouns', () => {
        ranker.byRank('nouns');
        expect(ranker.idRankMap).toEqual({});
      });
    });

    context('simple idCountMap', () => {
      const idCountMap = {
        user: 2,
        type: 1,
      };

      beforeAll(() => {
        ranker.addToRankMap(idCountMap, 0);
      });

      describe('addToRankMap', () => {
        it('ranks ids from stmtMatcher', () => {
          const idCountMap = {
            user: 2,
            type: 1,
          };
          expect(ranker.idRankMap).toEqual({});
        });
      });

      describe('getRank', () => {
        it('gets rank of index id', () => {
          const rank = ranker.getRank(0);
          expect(rank).toEqual(1);
        });
      });

      describe('calcRank', () => {
        it('calculate rank of rank entry', () => {
          const entry = {
            count: 1,
            rank: 1.5,
            indexList: [0, 2],
          };
          ranker.calcRank(entry);
          const rank = ranker.getRank(0);
          expect(rank).toEqual(1);
        });
      });

      describe('calcRanks()', () => {
        it('calculate ranks', () => {
          ranker.calcRanks();
          const rank = ranker.getRank(0);
          expect(rank).toEqual(1);
        });
      });
    });
  });
});
