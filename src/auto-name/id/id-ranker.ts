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

  constructor(public grammar: GrammarSet) {}

  rankIdLists() {
    listNames.map((name) => this.setRanked(name));
    return this;
  }

  setRanked(name: string) {
    this.ranked[name] = this.grammarByRank(name);
    return this;
  }

  grammarByRankAsEntries(name: string) {
    const list = this.grammarByRank(name);
    return list.map((key: string) => {
      const rankObj = this.idRankMap[key];
      const rank = rankObj?.rank;
      return { key, rank };
    });
  }

  grammarByRank(name: string) {
    const grammarList = (this.grammar as any)[name] || [];
    return grammarList.sort((k1: string, k2: string) => {
      const entry1 = this.idRankMap[k1];
      const entry2 = this.idRankMap[k2];
      if (!entry1 || !entry2) return;
      if (!entry1.rank) {
        this.idRankMap[k1] = this.calcRank(entry1);
      }
      if (!entry2.rank) {
        this.idRankMap[k2] = this.calcRank(entry2);
      }
      return entry1.rank - entry2.rank;
    });
  }

  addToRankMap(idCountMap: AnyOpts, index: number) {
    Object.keys(idCountMap).map((k: string, i: number) => {
      const count = idCountMap[k];
      this.idRankMap[k] = this.idRankMap[k] || {};
      const idMapEntry: any = this.idRankMap[k];

      idMapEntry.count = idMapEntry.count || 0;
      idMapEntry.count = idMapEntry.count + (count || 0);

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
      entry.rank = (entry.rank || 0) + rank;
    });
    return entry;
  }

  calcRanks() {
    const mapEntries = Object.values(this.idRankMap);
    mapEntries.map((entry: IdRankMapEntry) => {
      this.calcRank(entry);
    });
    this.rankIdLists();
    return this;
  }
}
