import { getLastStatement } from '../../find';
import { Statement } from 'typescript';
import { Block } from 'typescript';
import {
  findArrayActionAndId,
  isSingularAction,
  isSingularActionNoun,
} from './action-name';
import { determineMainIdentifier } from '../id-matcher';
import { createStmtMatcher, StatementMatcher } from './statement-name';
import * as inflection from 'inflection';
import {
  camelizedIdentifier,
  createSingularArrayMatcher,
  ensureValidParts,
  shouldAddExtraNoun,
  unique,
} from '../utils';
import { conditionName, conditionParts } from '../condition';

export const createBlockMatcher = (block: Block) => new BlockMatcher(block);

export const blockName = (block: Block) => createBlockMatcher(block).toName();

export class BlockMatcher {
  mainId: string = '';
  arrayOps: string[] = [];
  stmtMatchers: StatementMatcher[] = [];

  listNames = [
    'unmatchedIds',
    'matchedIds',
    'nouns',
    'verbs',
    'adjectives',
    'prepositions',
    'actions',
  ];
  unmatchedIds: string[] = [];
  matchedIds: string[] = [];
  nouns: string[] = [];
  verbs: string[] = [];
  adjectives: string[] = [];
  prepositions: string[] = [];
  actions: string[] = [];
  idCountMap: any = {};
  ranked: any = {};

  constructor(public block: Block) {
    this.findMainId();
    this.processStatements();
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
      (k1: string, k2: string) => this.idCountMap[k1] - this.idCountMap[k2],
    );
  }

  popStatementMatcher() {
    return this.stmtMatchers.pop();
  }

  findMainId() {
    this.mainId = determineMainIdentifier(this.block) || this.mainId;
    return this;
  }

  processStatements() {
    this.statementsLatestFirst.map((stmt: Statement) => {
      const stmtMatcher = createStmtMatcher(stmt);
      this.processStmtMatcher(stmtMatcher);
      this.stmtMatchers.push(stmtMatcher);
    });
  }

  add(label: string, stmtMatcher: StatementMatcher) {
    const arr: any[] = (this as any)[label];
    arr.push(...(stmtMatcher as any)[label]);
    return this;
  }

  addIdCountMap(idCountMap: any) {
    idCountMap.entries(([k, v]: [string, number]) => {
      this.idCountMap[k] = this.idCountMap[k] || 0;
      this.idCountMap[k] = this.idCountMap[k] + v;
    });
    return this;
  }

  transferIdLists(stmtMatcher: StatementMatcher) {
    this.listNames.map((lbl) => this.add(lbl, stmtMatcher));
    return this;
  }

  processStmtMatcher(stmtMatcher: StatementMatcher) {
    this.transferIdLists(stmtMatcher);
    this.addIdCountMap(stmtMatcher.idCountMap);
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

  getBeforeNoun({ action }: any) {
    if (action === 'find') return 'where';
    return 'by';
  }

  // TODO: refactor
  toName() {
    const stmtMatcher = this.popStatementMatcher();

    if (!stmtMatcher) return;
    let { arrayOps, mainId } = this;
    let { verbs, adjectives, prepositions, nouns } = stmtMatcher;
    const action = arrayOps[0] || verbs[0];

    if (isSingularActionNoun({ action, id: mainId })) {
      mainId = inflection.singularize(mainId);
    }

    nouns = nouns.filter((noun) => !arrayOps.includes(noun)).reverse();

    let beforeNoun = [adjectives[0], prepositions[0]].filter((x) => x);
    let noun = nouns.pop();
    if (mainId.includes('' + noun)) {
      noun = nouns.pop();
    }

    let beforeNounStr =
      beforeNoun.length === 0
        ? this.getBeforeNoun({ action, noun })
        : beforeNoun.join('-');

    const condParts = conditionParts(stmtMatcher.stmt);

    // pick the best combination (best effort)
    let parts = [action, mainId, beforeNounStr, noun, ...condParts];

    parts = ensureValidParts(parts);
    // console.log({ parts });
    if (shouldAddExtraNoun(parts)) {
      // console.log('add extra', { parts, nouns });
      parts.push(nouns.pop());
    }

    const removeGrammaticalDuplicates = createSingularArrayMatcher(parts);

    const filteredParts = unique(parts)
      .filter((x) => x)
      .filter(removeGrammaticalDuplicates);

    return camelizedIdentifier(filteredParts);
  }
}
