import {
  SentenceMaker,
  GrammarObject,
  GrammarSubject,
  createSentenceMaker,
} from './../sentence-maker';
import { Block } from 'typescript';
import { BlockMatcher, createBlockMatcher, getMainId } from './block-matcher';
import {
  camelizedIdentifier,
  createSingularArrayMatcher,
  unique,
} from '../utils';
import { conditionParts } from '../condition';
import { StatementMatcher } from './statement-matcher';

export const createBlockName = (block: Block) => new BlockName(block);

export const blockName = (block: Block) => createBlockName(block).toName();

const subjectPrepositionMap: any = {
  in: ['context', 'ctx', 'product', 'user', 'admin', 'role'],
  on: ['canvas', 'plane', 'screen'],
};

const actionPrepositionMap: any = {
  by: ['sort', 'filter', 'reduce'],
  where: ['find'],
};

export const prepositionForSubject = (subject?: string) => {
  if (!subject) return;
  return Object.keys(subjectPrepositionMap).find((key) => {
    const list = subjectPrepositionMap[key];
    list.includes(subject);
  });
};

export const prepositionForAction = (action?: string) => {
  if (!action) return;
  return Object.keys(actionPrepositionMap).find((key) => {
    const list = actionPrepositionMap[key];
    list.includes(action);
  });
};

export class BlockName {
  matcher: BlockMatcher;
  stmtMatcher: StatementMatcher | undefined;
  firstNoun: string | undefined;
  nouns: string[] = [];
  sentenceMaker: SentenceMaker;
  subject?: GrammarSubject;
  object?: GrammarObject;

  constructor(public block: Block) {
    this.matcher = createBlockMatcher(block);
    this.setNouns();
    this.setSubject();
    this.setObject();
    this.sentenceMaker = this.createSentenceMaker();
  }

  setObject() {
    this.object = this.object || {
      noun: this.nextNoun(),
      action: this.action,
    };
  }

  setSubject() {
    this.subject = this.subject || {
      noun: this.nextNoun(),
      preposition: this.preposition,
    };
  }

  createSentenceMaker() {
    return createSentenceMaker({ object: this.object, subject: this.subject });
  }

  nextStatementMatcher() {
    return this.matcher.nextStatementMatcher();
  }

  setNouns() {
    this.nouns = this.raw.nouns
      .filter((noun) => !this.raw.arrayOps.includes(noun))
      .reverse();
  }

  get mainId() {
    const { action } = this;
    const id = this.noun || '';
    return getMainId({ action, id });
  }

  get raw() {
    const { matcher } = this;
    return {
      nouns: matcher.nouns,
      unmatchedWords: matcher.unmatchedWords,
      verbs: matcher.verbs,
      adjectives: matcher.adjectives,
      prepositions: matcher.prepositions,
      arrayOps: matcher.arrayOps,
    };
  }

  get firstAdjective() {
    return this.raw.adjectives[0];
  }

  get firstPreposition() {
    return (
      this.raw.prepositions[0] ||
      this.prepositionFor(this.subject?.noun, this.object?.action)
    );
  }

  prepositionFor(subject?: string, action?: string) {
    return prepositionForSubject(subject) || prepositionForAction(action);
  }

  get preposition() {
    return this.firstPreposition;
  }

  get action() {
    const { arrayOps, verbs } = this.raw;
    return arrayOps[0] || verbs[0];
  }

  nextNoun() {
    return this.nouns.pop() || this.raw.unmatchedWords.pop();
  }

  get noun() {
    if (this.firstNoun) return this.firstNoun;
    const { nouns, mainId } = this;
    let noun = this.nextNoun();
    if (mainId && mainId.includes('' + noun)) {
      noun = nouns.pop();
    }
    this.firstNoun = noun;
    return noun;
  }

  conditionParts() {
    return this.stmtMatcher ? conditionParts(this.stmtMatcher.stmt) : [];
  }

  filtered(parts: any[]) {
    const removeGrammaticalDuplicates = createSingularArrayMatcher(parts);
    return unique(parts)
      .filter((x) => x)
      .filter(removeGrammaticalDuplicates);
  }

  //   getParts() {
  //     const { action, mainId, noun, nouns } = this;
  //     // pick the best combination (best effort)
  //     let parts = [action, mainId, beforeNoun, noun, ...this.conditionParts()];
  //     parts = ensureValidParts(parts);
  //     if (shouldAddExtraNoun(parts)) {
  //       // console.log('add extra', { parts, nouns });
  //       parts.push(nouns.pop());
  //     }
  //     return this.filtered(parts);
  //   }

  toName(): string | undefined {
    return camelizedIdentifier(this.sentenceMaker.parts);
  }
}
