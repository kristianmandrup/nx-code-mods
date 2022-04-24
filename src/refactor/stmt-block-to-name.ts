// use verb-corpus
// https://www.npmjs.com/package/irregular-plurals
// https://www.npmjs.com/package/node-irregular-nouns-list
// https://www.npmjs.com/package/noun-json
// from npm
import { nouns } from './nouns';
import humanize from 'humanize-string';
import { complete as verbs } from 'verb-corpus';
import * as adjectives from 'adjectives';
import * as prepositions from 'prepositions';
import { Block } from 'typescript';
import { findAllIdentifiersFor } from '../find';

export function arrToObject(arr: string[]) {
  var i,
    hash: any = {};
  for (i = 0; i < arr.length; i++) {
    hash[arr[i]] = arr[i];
  }
  return hash;
}

const nounsMap = arrToObject(nouns);
const verbsMap = arrToObject(verbs);
const adjectivesMap = arrToObject(adjectives);
const prepositionsMap = arrToObject(prepositions);

export const stmtBlockToName = (block: Block) => {
  const ids = findAllIdentifiersFor(block);
  const revIds = ids.reverse();
  const revStrIds: string[] = revIds.map((id) => id.escapedText as string);
  const nouns: string[] = [];
  const verbs: string[] = [];
  const adjectives: string[] = [];
  const prepositions: string[] = [];

  const last3Ids = revStrIds.splice(3);
  last3Ids.map((id) => {
    const matcher = idMatcher(id);
    adjectives.push(...matcher.adjectives);
    verbs.push(...matcher.verbs);
    nouns.push(...matcher.nouns);
    prepositions.push(...matcher.prepositions);
  });
  // TODO: pick the best combination
  return verbs[0] + adjectives[0] + prepositions[0] + nouns[0];
};

export const idMatcher = (identifier: string) =>
  new IdentifierMatcher(identifier);

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

  split() {
    this.words = humanize(this.identifier).split(' ');
    return this;
  }

  getAdjectives() {
    this.adjectives = this.words.filter((word) => adjectivesMap[word]);
    return this;
  }

  getPrepositions() {
    this.prepositions = this.words.filter((word) => prepositionsMap[word]);
  }

  getNouns() {
    this.nouns = this.words.filter((word) => nounsMap[word]);
    return this;
  }

  getVerbs() {
    this.verbs = this.words.filter((word) => verbsMap[word]);
    return this;
  }
}
