import { arrToObject, idToStr, unique } from './utils';
import * as inflection from 'inflection';
import { nouns } from '../refactor/nouns';
import { complete as verbs } from 'verb-corpus';
import * as adjectives from 'adjectives';
import * as prepositions from 'prepositions';
import { Block } from 'typescript';
import { findFirstIdentifier, getLastStatement } from '../find';

const nounAliases = ['admin', 'id'];

const nounsMap = arrToObject([...nouns, ...nounAliases]);
const verbsMap = arrToObject(verbs);
const adjectivesMap = arrToObject(adjectives);
const prepositionsMap = arrToObject(prepositions);

export const idMatcher = (identifier: string) =>
  new IdentifierMatcher(identifier);

export const determineMainIdentifier = (block: Block): string | undefined => {
  const lastStmt = getLastStatement(block);
  const id = findFirstIdentifier(lastStmt);
  if (!id) return;
  return idToStr(id);
};

export const isNoun = (txt: string) => nounsMap[inflection.singularize(txt)];

export class IdentifierMatcher {
  words: string[] = [];
  nouns: string[] = [];
  verbs: string[] = [];
  adjectives: string[] = [];
  prepositions: string[] = [];

  constructor(public identifier: string) {
    this.split();
    this.getNouns();
    this.getVerbs();
  }

  humanize(str: string) {
    const wordRegex = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;
    const matches = str.match(wordRegex);
    return matches?.join(' ') || str;
  }

  split() {
    const humanized = this.humanize(this.identifier);
    this.words = unique(
      humanized.split(' ').map((w: string) => w.toLowerCase()),
    );
    return this;
  }

  getAdjectives() {
    this.adjectives = unique(this.words.filter((word) => adjectivesMap[word]));
    return this;
  }

  getPrepositions() {
    this.prepositions = unique(
      this.words.filter((word) => prepositionsMap[word]),
    );
  }

  getNouns() {
    this.nouns = unique(this.words.filter((word) => nounsMap[word]));
    return this;
  }

  getVerbs() {
    this.verbs = unique(this.words.filter((word) => verbsMap[word]));
    return this;
  }
}
