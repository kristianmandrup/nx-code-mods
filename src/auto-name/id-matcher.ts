import { arrToObject, humanize, idToStr, unique, wordsFromId } from './utils';
import * as inflection from 'inflection';
import { nouns } from './nouns';
import { complete as verbs } from 'verb-corpus';
import * as adjectives from 'adjectives';
import * as prepositions from 'prepositions';
import { Block } from 'typescript';
import { findFirstIdentifier, getLastStatement } from '../find';

const nounAliases = ['admin', 'id', 'ctx'];

const nounsMap = arrToObject([...nouns, ...nounAliases]);
const verbsMap = arrToObject(verbs);
const adjectivesMap = arrToObject(adjectives);
const prepositionsMap = arrToObject(prepositions);

export const mapWords = (words: string[], kvMap: any) =>
  unique(words.filter((word) => kvMap[word]));

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
    return humanize(str);
  }

  split() {
    this.words = wordsFromId(this.identifier);
    return this;
  }

  getAdjectives() {
    this.adjectives = mapWords(this.words, adjectivesMap);
    return this;
  }

  getPrepositions() {
    this.prepositions = mapWords(this.words, prepositionsMap);
  }

  getNouns() {
    this.nouns = mapWords(this.words, nounsMap);
    return this;
  }

  getVerbs() {
    this.verbs = mapWords(this.words, verbsMap);
    return this;
  }
}
