import { AnyOpts } from '../../modify';
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
    const grammarList = (this.grammarSet as any)[name] || [];
    console.log('byRank', { name, grammarSet: this.grammarSet });
    this.ranked[name] = grammarList.sort((k1: string, k2: string) => {
      const entry1 = this.idRankMap[k1];
      const entry2 = this.idRankMap[k2];
      console.log({ k1, k2, entry1, entry2 });
      if (!entry1 || !entry2) return;
      return entry1.rank - entry2.rank;
    });
  }

  addToRankMap(idCountMap: AnyOpts, index: number) {
    Object.keys(idCountMap).map((k: string, i: number) => {
      const idCountMapEntry = idCountMap[k];
      console.log({ idCountMap, index, k, i, idCountMapEntry });

      this.idRankMap[k] = this.idRankMap[k] || {};
      const idMapEntry: any = this.idRankMap[k];

      idMapEntry.count = idMapEntry.count || 0;
      idMapEntry.count = idMapEntry.count + (idCountMapEntry.count || 0);
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
    entry.indexList = entry.indexList || [];
    entry.indexList.map((index) => {
      const rank = this.getRank(index);
      // todo: iterate indexList to calc rank
      entry.rank = (entry.rank || 0) + rank;
    });
  }

  calcRanks() {
    const mapEntries = Object.values(this.idRankMap);
    console.log({ mapEntries });
    mapEntries.map((entry: IdRankMapEntry) => {
      this.calcRank(entry);
    });
  }
}
