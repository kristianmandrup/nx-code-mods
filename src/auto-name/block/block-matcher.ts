import { IdRanker } from './../id/id-ranker';
import { GrammarMatcher } from './../grammar-matcher';
import { getLastStatement } from '../../find';
import { Statement } from 'typescript';
import { Block } from 'typescript';
import { findArrayActionAndId, isSingularActionNoun } from './action-name';
import { determineMainIdentifier } from '../id/id-matcher';
import { createStmtMatcher, StatementMatcher } from './statement-matcher';
import * as inflection from 'inflection';
import { listNames, unique } from '../utils';

export const createBlockMatcher = (block: Block) => new BlockMatcher(block);

export const getMainId = ({ action, id }: { action: string; id: string }) => {
  return isSingularActionNoun({ action, id }) ? inflection.singularize(id) : id;
};

export type IdRankMapEntry = {
  count: number;
  rank: number;
  indexList: number[];
};

export type IdRankMap = {
  [key: string]: IdRankMapEntry;
};

export class BlockMatcher extends GrammarMatcher {
  mainId: string = '';
  arrayOps: string[] = [];
  stmtMatchers: StatementMatcher[] = [];
  actions: string[] = [];
  ranker: IdRanker = new IdRanker(this.grammar);

  constructor(public block: Block) {
    super();
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

  get ranked() {
    return this.ranker.ranked;
  }

  get idRankMap() {
    return this.ranker.idRankMap;
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

  nextStatementMatcher() {
    return this.stmtMatchers.shift();
  }

  findMainId() {
    this.mainId = determineMainIdentifier(this.block) || this.mainId;
    return this;
  }

  processStatements() {
    this.ranker = new IdRanker(this.grammar);
    this.statementsLatestFirst.map((stmt: Statement, index: number) => {
      const stmtMatcher = createStmtMatcher(stmt, index);
      this.processStmtMatcher(stmtMatcher, index);
      this.stmtMatchers.push(stmtMatcher);
    });
    this.ranker.calcRanks();
  }

  shouldBeUnique(key: string, makeUnique: boolean = false) {
    return makeUnique || !['ids'].includes(key);
  }

  add(key: string, stmtMatcher: StatementMatcher, makeUnique: boolean = false) {
    const arr: any[] = (this as any)[key];
    const stmtGrammarList = (stmtMatcher as any)[key];
    arr.push(...stmtGrammarList);
    if (this.shouldBeUnique(key, makeUnique)) {
      this.setGrammar(key, unique(arr));
    }
    return this;
  }

  setGrammar(key: string, list: any[]) {
    (this.grammar as any)[key] = list;
  }

  transferIdLists(stmtMatcher: StatementMatcher) {
    listNames.map((key) => this.add(key, stmtMatcher));
    return this;
  }

  processStmtMatcher(stmtMatcher: StatementMatcher, index: number) {
    this.transferIdLists(stmtMatcher);
    this.ranker.addToRankMap(stmtMatcher.idCountMap, index);
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
