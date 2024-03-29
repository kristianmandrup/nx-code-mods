import { GrammarMatcher } from './../grammar-matcher';
import { arrToObject, humanize, unique, wordsFromId } from '../utils';
import * as inflection from 'inflection';
import { nouns } from '../nouns';
import { complete as verbs } from 'verb-corpus';
import * as adjectives from 'adjectives';
import * as prepositions from 'prepositions';
import { Block } from 'typescript';
import {
  idToStr,
  findFirstIdentifier,
  getLastStatement,
  findLastIdentifierOrLit,
} from '../../find';

const nounAliases = ['admin', 'id', 'ctx'];

const nounsMap = arrToObject([...nouns, ...nounAliases]);
const nounsExcludeMap: any = {
  set: true,
};

const verbsMap = arrToObject(verbs);

const verbsExcludeMap: any = {
  type: true,
};

const adjectivesMap = arrToObject(adjectives);
const prepositionsMap = arrToObject(prepositions);

export const mapWords = (words: string[], includeMap: any, excludeMap?: any) =>
  unique(
    words.filter((word) => {
      return includeMap[word] && !(excludeMap && excludeMap[word]);
    }),
  );

export const idMatcher = (identifier: string) =>
  new IdentifierMatcher(identifier);

export const determineMainIdentifier = (block: Block): string | undefined => {
  const lastStmt = getLastStatement(block);
  const id = findLastIdentifierOrLit(lastStmt);
  if (!id) return;
  return idToStr(id);
};

export const isNoun = (txt: string) => nounsMap[inflection.singularize(txt)];

export class IdentifierMatcher extends GrammarMatcher {
  constructor(public identifier: string) {
    super();
    this.split();
    this.getNouns();
    this.getVerbs();
  }

  humanize(str: string) {
    return humanize(str);
  }

  split() {
    this.grammar.words = wordsFromId(this.identifier);
    return this;
  }

  getAdjectives() {
    this.grammar.adjectives = mapWords(this.grammar.words, adjectivesMap);
    return this;
  }

  getPrepositions() {
    this.grammar.prepositions = mapWords(this.grammar.words, prepositionsMap);
  }

  getNouns() {
    this.grammar.nouns = mapWords(
      this.grammar.words,
      nounsMap,
      nounsExcludeMap,
    );
    return this;
  }

  getVerbs() {
    this.grammar.verbs = mapWords(
      this.grammar.words,
      verbsMap,
      verbsExcludeMap,
    );
    return this;
  }
}
