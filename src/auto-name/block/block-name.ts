import { getLastStatement } from './../../find/find';
import { Statement } from 'typescript';
import { Block } from 'typescript';
import {
  findArrayActionAndId,
  isSingularAction,
  isSingularActionNoun,
} from './action-name';
import { determineMainIdentifier } from './id-matcher';
import { createStmtMatcher, StatementMatcher } from './statement-name';
import * as inflection from 'inflection';
import {
  camelizedIdentifier,
  createArrayMatcher,
  createSingularArrayMatcher,
} from '../utils';

export const createBlockMatcher = (block: Block) => new BlockMatcher(block);

export const blockName = (block: Block) => createBlockMatcher(block).toName();

export class BlockMatcher {
  mainId: string = '';
  arrayOps: string[] = [];
  stmtMatchers: StatementMatcher[] = [];

  constructor(public block: Block) {
    this.findMainId();
    this.getActions();
  }

  get statements() {
    return this.block.statements;
  }

  get lastStatement() {
    return getLastStatement(this.block);
  }

  popStatementMatcher() {
    return this.stmtMatchers.pop();
  }

  findMainId() {
    this.mainId = determineMainIdentifier(this.block) || this.mainId;
    return this;
  }

  getActions() {
    this.statements.map((stmt: Statement) => {
      const stmtMatcher = createStmtMatcher(stmt);
      this.stmtMatchers.push(stmtMatcher);
      const result = findArrayActionAndId(stmtMatcher);
      if (!result) return;
      const { action, id } = result as any;
      this.arrayOps.push(action);
      this.mainId = id;
    });
  }

  getBeforeNoun({ action }: any) {
    if (action === 'find') return 'where';
    return 'by';
  }

  toName() {
    const stmtMatcher = this.popStatementMatcher();
    if (!stmtMatcher) return;
    let { arrayOps, mainId } = this;
    let { verbs, adjectives, prepositions, nouns } = stmtMatcher;
    const action = arrayOps[0] || verbs[0];

    if (isSingularActionNoun({ action, id: mainId })) {
      mainId = inflection.singularize(mainId);
    }

    nouns = nouns.filter((noun) => !arrayOps.includes(noun));

    let beforeNoun = [adjectives[0], prepositions[0]].filter((x) => x);
    let noun = nouns[0];
    if (mainId.includes(noun)) {
      noun = nouns[1];
    }

    let beforeNounStr =
      beforeNoun.length === 0
        ? this.getBeforeNoun({ action, noun })
        : beforeNoun.join('-');

    // pick the best combination (best effort)
    const parts = [action, mainId, beforeNounStr, noun];
    const removeGrammaticalDuplicates = createSingularArrayMatcher(parts);

    const filteredParts = parts
      .filter((x) => x)
      .filter(removeGrammaticalDuplicates);

    return camelizedIdentifier(filteredParts);
  }
}
