import { Block } from 'typescript';
import { BlockMatcher, createBlockMatcher } from './block-matcher';
import {
  camelizedIdentifier,
  createSingularArrayMatcher,
  ensureValidParts,
  shouldAddExtraNoun,
  unique,
} from '../utils';
import { conditionParts } from '../condition';
import { StatementMatcher } from './statement-matcher';

export const createBlockName = (block: Block) => new BlockName(block);

export const blockName = (block: Block) => createBlockName(block).toName();

export class BlockName {
  matcher: BlockMatcher;
  stmtMatcher: StatementMatcher | undefined;
  firstNoun: string | undefined;

  constructor(public block: Block) {
    this.matcher = createBlockMatcher(block);
    this.stmtMatcher = this.nextStatementMatcher();
  }

  nextStatementMatcher() {
    return this.matcher.nextStatementMatcher();
  }

  get mainId() {
    return this.matcher.getMainId(this.stmtMatcher);
  }

  get verbs() {
    return this.matcher.nouns;
  }

  get nouns() {
    return this.matcher.nouns;
  }

  get adjectives() {
    return this.matcher.adjectives;
  }

  get prepositions() {
    return this.matcher.prepositions;
  }

  get arrayOps() {
    return this.matcher.arrayOps;
  }

  getNouns() {
    return this.nouns.filter((noun) => !this.arrayOps.includes(noun)).reverse();
  }

  get beforeNoun() {
    return [this.adjectives[0], this.prepositions[0]].filter((x) => x);
  }

  getBeforeNoun({ action }: any) {
    if (action === 'find') return 'where';
    return 'by';
  }

  getBeforeNounStr() {
    const { beforeNoun, action } = this;
    const noun = this.getFirstNoun();
    return beforeNoun.length === 0
      ? this.getBeforeNoun({ action, noun })
      : beforeNoun.join('-');
  }

  get action() {
    const { arrayOps, verbs } = this;
    return arrayOps[0] || verbs[0];
  }

  getFirstNoun() {
    if (this.firstNoun) return this.firstNoun;
    const { nouns, mainId } = this;
    let noun = nouns.pop();
    if (mainId && mainId.includes('' + noun)) {
      noun = nouns.pop();
    }
    this.firstNoun = noun;
    return noun;
  }

  toName(): string | undefined {
    const { mainId, stmtMatcher, nouns, action } = this;
    if (!stmtMatcher) return;

    let beforeNounStr = this.getBeforeNounStr();
    const condParts = conditionParts(stmtMatcher.stmt);
    const noun = this.getFirstNoun();

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
