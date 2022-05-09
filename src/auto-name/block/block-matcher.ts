import { IdRanker } from './../id/id-ranker';
import { GrammarMatcher } from './../grammar-matcher';
import { GrammarSet } from './../';
import { getLastStatement } from '../../find';
import { Statement } from 'typescript';
import { Block } from 'typescript';
import { findArrayActionAndId, isSingularActionNoun } from './action-name';
import { determineMainIdentifier } from '../id/id-matcher';
import { createStmtMatcher, StatementMatcher } from './statement-matcher';
import * as inflection from 'inflection';
import { listNames } from '../utils';

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
  ids: string[] = [];
  unmatchedIds: string[] = [];
  matchedIds: string[] = [];
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

  add(label: string, stmtMatcher: StatementMatcher) {
    const arr: any[] = (this as any)[label];
    arr.push(...(stmtMatcher as any)[label]);
    return this;
  }

  transferIdLists(stmtMatcher: StatementMatcher) {
    listNames.map((lbl) => this.add(lbl, stmtMatcher));
    return this;
  }

  processStmtMatcher(stmtMatcher: StatementMatcher, index: number) {
    this.transferIdLists(stmtMatcher);
    this.ranker.rank(stmtMatcher, index);
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
