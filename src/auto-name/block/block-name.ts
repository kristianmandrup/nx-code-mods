import { getLastStatement } from './../../find/find';
import { Statement } from 'typescript';
import { Block } from 'typescript';
import { findArrayActionAndId, isSingularAction } from './action-name';
import { determineMainIdentifier } from './id-matcher';
import { createStmtMatcher, StatementMatcher } from './statement-name';
import * as inflection from 'inflection';
import { camelizedIdentifier } from '../utils';

export const createBlockMatcher = (block: Block) => new BlockMatcher(block);

export const blockName = (block: Block) => createBlockMatcher(block).toName();

export class BlockMatcher {
  mainId: string = '';
  arrayOps: string[] = [];
  stmtMatchers: StatementMatcher[] = [];

  constructor(public block: Block) {}

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

  toName() {
    const stmtMatcher = this.popStatementMatcher();
    if (!stmtMatcher) return;
    const { arrayOps, mainId } = this;
    const { verbs, adjectives, prepositions, nouns } = stmtMatcher;

    const action = arrayOps[0] || verbs[0];
    if (isSingularAction({ action, id: mainId })) {
      this.mainId = inflection.singularize(mainId);
    }

    let beforeNoun = [adjectives[0], prepositions[0]].filter((x) => x);

    let beforeNounStr = beforeNoun.length === 0 ? 'by' : beforeNoun.join('-');
    let nounStr = nouns[0];

    // pick the best combination (best effort)
    const parts = [action, mainId, beforeNounStr, nounStr].filter((x) => x);
    return camelizedIdentifier(parts);
  }
}
