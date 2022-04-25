import { Identifier, isCallSignatureDeclaration } from 'typescript';
import * as inflection from 'inflection';
import { nouns } from './nouns';
import { complete as verbs } from 'verb-corpus';
import * as adjectives from 'adjectives';
import * as prepositions from 'prepositions';
import { Block } from 'typescript';
import { findAllIdentifiersFor, findFirstIdentifier } from '../find';
import { escapeRegExp } from '../utils';

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

export const determineMainIdentifier = (
  block: Block,
  ids: string[],
): string | undefined => {
  const lastStmt = block.statements[block.statements.length - 1];
  const id = findFirstIdentifier(lastStmt);
  if (!id) return;
  return id.escapedText as string;
};

export const stmtBlockToName = (block: Block) => {
  const ids: Identifier[] = findAllIdentifiersFor(block);
  const revIds = ids.reverse();
  const revStrIds: string[] = revIds.map((id) => id.escapedText as string);
  let mainId = determineMainIdentifier(block, revStrIds);
  const nouns: string[] = [];
  const verbs: string[] = [];
  const adjectives: string[] = [];
  const prepositions: string[] = [];
  const arrayOps: string[] = [];
  const last3Ids = revStrIds.splice(3);
  revStrIds.map((strId) => {
    const matcher = idMatcher(strId);
    adjectives.push(...matcher.adjectives);
    verbs.push(...matcher.verbs);
    nouns.push(...matcher.nouns);
    prepositions.push(...matcher.prepositions);
  });

  block.statements.find((stmt) => {
    const stmtStr = stmt.getFullText();
    const result = findArrayActionAndId(last3Ids, stmtStr);
    if (!result) return;
    const { action, id } = result as any;
    arrayOps.push(action);
    mainId = id;
  });

  const actionPluralityMap: any = {
    find: true,
  };

  const isSingular = (action: string) => {
    return actionPluralityMap[action];
  };

  const isNoun = (txt: string) => nounsMap[inflection.singularize(txt)];

  const action = arrayOps[0] || verbs[0];

  if (isSingular(action) && mainId && isNoun(mainId)) {
    mainId = inflection.singularize(mainId);
  }
  let beforeNoun = [adjectives[0], prepositions[0]].filter((x) => x);

  let beforeNounStr = beforeNoun.length === 0 ? 'by' : beforeNoun.join('-');
  let nounStr = nouns[0];

  // pick the best combination (best effort)
  const parts = [action, mainId, beforeNounStr, nounStr].filter((x) => x);
  return inflection.camelize(parts.join('_'), true);
};

const arrayOpsMap: any = {
  map: 'mapped',
  reverse: 'reversed',
  filter: 'filtered',
  reduce: 'reduced',
  find: 'find',
  join: 'joined',
  fill: 'filled',
  slice: 'sliced',
  sort: 'sorted',
  group: 'grouped',
};

const arrayOps = Object.keys(arrayOpsMap);

const findArrayActionAndId = (ids: string[], stmtTxt: string) => {
  let foundOp, foundId;
  ids.find((id) => {
    const op = findArrayOp(id, stmtTxt);
    if (op) {
      foundId = id;
      foundOp = op;
    }
    return op;
  });

  if (!foundOp) return;
  const arrayOp = arrayOpsMap[foundOp];
  return {
    action: arrayOp,
    id: foundId,
  };
};

const findArrayOp = (id: string, stmtTxt: string) => {
  return arrayOps.find((op) => {
    const idExp = escapeRegExp(id);
    const opExp = escapeRegExp(op);
    const regExp = new RegExp(idExp + '.' + opExp + `\\s*\\(`);
    const matches = stmtTxt.match(regExp);
    return matches;
  });
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
    this.words = inflection
      .humanize(this.identifier)
      .split(' ')
      .map((w: string) => w.toLowerCase());
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
