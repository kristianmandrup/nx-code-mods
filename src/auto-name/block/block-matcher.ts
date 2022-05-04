import { getLastStatement } from '../../find';
import { Statement } from 'typescript';
import { Block } from 'typescript';
import { findArrayActionAndId, isSingularActionNoun } from './action-name';
import { determineMainIdentifier } from '../id-matcher';
import { createStmtMatcher, StatementMatcher } from './statement-matcher';
import * as inflection from 'inflection';

export const createBlockMatcher = (block: Block) => new BlockMatcher(block);

export type IdRankMapEntry = {
  count: number;
  rank: number;
  indexList: number[];
};

export type IdRankMap = {
  [key: string]: IdRankMapEntry;
};

export class BlockMatcher {
  mainId: string = '';
  arrayOps: string[] = [];
  stmtMatchers: StatementMatcher[] = [];

  listNames = [
    'ids',
    'unmatchedIds',
    'matchedIds',
    'nouns',
    'verbs',
    'adjectives',
    'prepositions',
    'actions',
  ];

  ids: string[] = [];
  unmatchedIds: string[] = [];
  matchedIds: string[] = [];
  nouns: string[] = [];
  verbs: string[] = [];
  adjectives: string[] = [];
  prepositions: string[] = [];
  actions: string[] = [];
  idRankMap: IdRankMap = {};
  ranked: any = {};

  indexRankMap: any = {
    0: 1.5,
    1: 1,
    2: 0.8,
    3: 0.6,
    default: 0.4,
  };

  constructor(public block: Block) {
    this.findMainId();
    this.processStatements();
  }

  getMainId(stmtMatcher: StatementMatcher | undefined) {
    if (!stmtMatcher) return;
    let { arrayOps, mainId } = this;
    let { verbs } = stmtMatcher;
    const action = arrayOps[0] || verbs[0];

    if (isSingularActionNoun({ action, id: mainId })) {
      mainId = inflection.singularize(mainId);
    }
    return mainId;
  }

  get statements() {
    return Array.from(this.block.statements);
  }

  get statementsLatestFirst() {
    return Array.from(this.block.statements).reverse();
  }

  get lastStatement() {
    return getLastStatement(this.block);
  }

  rankIdLists() {
    this.listNames.map((name) => this.byRank(name));
    return this;
  }

  byRank(name: string) {
    this.ranked[name] = (this as any)[name].sort(
      (k1: string, k2: string) =>
        this.idRankMap[k1].rank - this.idRankMap[k2].rank,
    );
  }

  nextStatementMatcher() {
    return this.stmtMatchers.shift();
  }

  findMainId() {
    this.mainId = determineMainIdentifier(this.block) || this.mainId;
    return this;
  }

  processStatements() {
    this.statementsLatestFirst.map((stmt: Statement, index: number) => {
      const stmtMatcher = createStmtMatcher(stmt, index);
      this.processStmtMatcher(stmtMatcher, index);
      this.stmtMatchers.push(stmtMatcher);
    });
    this.calcRanks();
  }

  add(label: string, stmtMatcher: StatementMatcher) {
    const arr: any[] = (this as any)[label];
    arr.push(...(stmtMatcher as any)[label]);
    return this;
  }

  addToRankMap(stmtMatcher: StatementMatcher, index: number) {
    stmtMatcher.idCountMap.entries(([k, count]: [string, number]) => {
      const idMapEntry = this.idRankMap[k];
      idMapEntry.count = idMapEntry.count || 0;
      idMapEntry.count = idMapEntry.count + count;
      idMapEntry.indexList = idMapEntry.indexList || [];
      idMapEntry.indexList.push(index);
    });
    return this;
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

  transferIdLists(stmtMatcher: StatementMatcher) {
    this.listNames.map((lbl) => this.add(lbl, stmtMatcher));
    return this;
  }

  processStmtMatcher(stmtMatcher: StatementMatcher, index: number) {
    this.transferIdLists(stmtMatcher);
    this.addToRankMap(stmtMatcher, index);
    this.rankIdLists();
    this.processArrayAction(stmtMatcher);
  }

  // TODO: do we really need to process array actions separately!?
  processArrayAction(stmtMatcher: StatementMatcher) {
    const result = findArrayActionAndId(stmtMatcher);
    if (!result) return;
    const { action, id } = result as any;
    this.arrayOps.push(action);
    this.mainId = id;
  }
}
