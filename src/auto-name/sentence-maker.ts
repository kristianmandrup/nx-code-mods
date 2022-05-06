import { createSingularArrayMatcher, ensureValidParts, unique } from './utils';

export const createSentenceMaker = (opts: SentenceMakerOpts) =>
  new SentenceMaker(opts);

export interface GrammarObject {
  noun?: string;
  action?: string;
}
export interface GrammarSubject {
  noun?: string;
  preposition?: string;
}

export interface SentenceMakerOpts {
  object: GrammarObject;
  subject: GrammarSubject;
}

export class SentenceMaker implements SentenceMakerOpts {
  object: GrammarObject;
  subject: GrammarSubject;

  constructor({ object, subject }: SentenceMakerOpts) {
    this.object = object;
    this.subject = subject;
  }

  filtered(parts: any[]) {
    const removeGrammaticalDuplicates = createSingularArrayMatcher(parts);
    return unique(this.ensureValidParts(parts)).filter(
      removeGrammaticalDuplicates,
    );
  }

  ensureValidParts(parts: any[]) {
    return ensureValidParts(parts);
  }

  parts() {
    const { object, subject } = this;
    return this.filtered([
      object.action,
      object.noun,
      subject.preposition,
      subject.noun,
    ]);
  }
}
