import {
  idMatcher,
  createRanker,
  IdRanker,
  IdentifierMatcher,
} from '../../../auto-name';

const context = describe;

describe('id ranker', () => {
  context('find users by type', () => {
    let ranker: IdRanker;
    let matcher: IdentifierMatcher;
    beforeEach(() => {
      matcher = idMatcher('setAdminType');
      ranker = createRanker(matcher.grammar);
    });

    describe('rankIdLists', () => {
      it('puts ranked ids in idRankMap', () => {
        ranker.rankIdLists();
        expect(ranker.idRankMap).toEqual({});
        expect(ranker.ranked.nouns).toEqual(['set', 'admin', 'type']);
        expect(ranker.ranked.verbs).toEqual(['set', 'type']);
      });
    });

    describe('grammarByRank', () => {
      it('ranks by nouns', () => {
        ranker.calcRanks();
        const list = ranker.grammarByRank('nouns');
        expect(list).toEqual(['set', 'admin', 'type']);
      });
    });

    describe('grammarByRankAsEntries', () => {
      it('ranks by nouns', () => {
        const idCountMaps: any = {
          0: {
            type: 1,
          },
          1: {
            set: 1,
            admin: 1,
          },
        };
        ranker.addToRankMap(idCountMaps[0], 0);
        ranker.addToRankMap(idCountMaps[1], 1);

        ranker.calcRanks();
        const rankedList = ranker.grammarByRankAsEntries('nouns');
        expect(rankedList).toEqual([
          {
            key: 'set',
            rank: 1,
          },
          {
            key: 'admin',
            rank: 1,
          },
          { key: 'type', rank: 1.5 },
        ]);
      });
    });

    describe('setRanked', () => {
      it('ranks by nouns', () => {
        ranker.setRanked('nouns');
        expect(ranker.idRankMap).toEqual({});
        expect(ranker.ranked.nouns).toEqual(['set', 'admin', 'type']);
      });
    });

    context('simple idCountMap', () => {
      let idCountMap;

      beforeEach(() => {
        idCountMap = {
          user: 1,
          type: 1,
        };
        ranker.addToRankMap(idCountMap, 0);
      });

      describe('addToRankMap', () => {
        it('ranks ids from stmtMatcher', () => {
          expect(ranker.idRankMap.user).toEqual({
            count: 1,
            indexList: [0],
          });
          expect(ranker.idRankMap.type).toEqual({
            count: 1,
            indexList: [0],
          });
        });
      });

      describe('getRank', () => {
        it('gets rank of index 0', () => {
          const rank = ranker.getRank(0);
          expect(rank).toEqual(1.5);
        });
      });

      describe('calcRank', () => {
        it('calculate rank of rank entry', () => {
          const entry = {
            count: 1,
            rank: 0,
            indexList: [0, 2],
          };
          ranker.calcRank(entry);
          expect(entry.rank).toEqual(2.3);
        });
      });

      describe('calcRanks()', () => {
        it('calculate ranks', () => {
          ranker.calcRanks();
          expect(ranker.idRankMap.type.rank).toEqual(1.5);
          expect(ranker.idRankMap.user.rank).toEqual(1.5);
        });
      });
    });
  });
});
