import { IdRankMap, IdRankMapEntry, StatementMatcher } from '../block';
import { GrammarSet } from '../grammar-matcher';
import { listNames } from '../utils';

export const createRanker = (grammarSet: GrammarSet) =>
  new IdRanker(grammarSet);

export class IdRanker {
  idRankMap: IdRankMap = {};
  ranked: any = {};

  indexRankMap: any = {
    0: 1.5,
    1: 1,
    2: 0.8,
    3: 0.6,
    default: 0.4,
  };

  constructor(public grammarSet: GrammarSet) {}

  rankIdLists() {
    listNames.map((name) => this.byRank(name));
    return this;
  }

  byRank(name: string) {
    this.ranked[name] = (this as any)[name].sort(
      (k1: string, k2: string) =>
        this.idRankMap[k1].rank - this.idRankMap[k2].rank,
    );
  }

  addToRankMap(idCountMap: any, index: number) {
    idCountMap.entries(([k, count]: [string, number]) => {
      const idMapEntry = this.idRankMap[k];
      idMapEntry.count = idMapEntry.count || 0;
      idMapEntry.count = idMapEntry.count + count;
      idMapEntry.indexList = idMapEntry.indexList || [];
      idMapEntry.indexList.push(index);
    });
    return this;
  }

  rank(idCountMap: any, index: number) {
    this.addToRankMap(idCountMap, index);
    this.rankIdLists();
  }

  getRank(index: number) {
    return this.indexRankMap[index] || this.indexRankMap['default'];
  }

  calcRank(entry: IdRankMapEntry) {
    entry.indexList.map((index) => {
      const rank = this.getRank(index);
      // todo: iterate indexList to calc rank
      entry.rank = entry.rank + rank;
    });
  }

  calcRanks() {
    (this.idRankMap as any).values((entry: IdRankMapEntry) => {
      this.calcRank(entry);
    });
  }
}
