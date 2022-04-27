import { Identifier, StringLiteral, Node } from 'typescript';
import { findAllIdentifiersOrStringLiteralsFor, IdLike } from '../find';
import * as inflection from 'inflection';
export const camelizedIdentifier = (parts: string[]) =>
  inflection.camelize(parts.join('_'), true);

export const idToStr = (id: Identifier | StringLiteral): string => {
  return id.text ? id.text : ((id as Identifier).escapedText as string);
};

export const sortByPosition = (nodeList: any[]) =>
  nodeList.sort((idA: any, idB: any) => idA.pos - idB.pos);

export const findNodeIds = (node: Node): string[] => {
  const ids: IdLike[] = findAllIdentifiersOrStringLiteralsFor(node);
  return ids.map(idToStr);
};

const adjectivesList = ['by', 'where'];
export const lastPartIsAdjective = (parts: string[]) => {
  const word = parts[parts.length - 1];
  return adjectivesList.includes(word);
};

export const shouldAddExtraNoun = (parts: string[]) =>
  parts.length >= 2 && lastPartIsAdjective(parts);

export const ensureValidParts = (parts: string[]) =>
  unique(
    parts.map((id) => humanize(id).toLowerCase().split(' ')).flat(),
  ).filter((x) => x);

export const wordsFromId = (identifier: string) => {
  const humanized = humanize(identifier);
  const list = humanized.split(' ').filter((x) => x);
  return unique(list.map((w: string) => w.toLowerCase()));
};

export const humanize = (str: string) => {
  if (!str) return '';
  const wordRegex = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;
  const matches = str.match(wordRegex);
  return matches?.join(' ') || str;
};

export const createArrayMatcher =
  (list: string[]) =>
  (x: string): boolean => {
    return isSingular(x)
      ? !list.includes(inflection.pluralize(x))
      : !list.includes(inflection.singularize(x));
  };

export const createSingularArrayMatcher =
  (list: string[]) =>
  (x: string): boolean => {
    return isSingular(x) ? !list.includes(inflection.pluralize(x)) : true;
  };

export const createPluralArrayMatcher =
  (list: string[]) =>
  (x: string): boolean => {
    return isPlural(x) ? list.includes(inflection.singularize(x)) : true;
  };

export const isSingular = (x: string) => inflection.singularize(x) === x;
export const isPlural = (x: string) => inflection.pluralize(x) === x;

export const unique = (list: any[]) => {
  var obj: any = {};

  list.forEach(function (v) {
    obj[v + '::' + typeof obj] = v;
  });

  return Object.keys(obj).map(function (v) {
    return obj[v];
  });
};

export function arrToObject(arr: string[]) {
  var i,
    hash: any = {};
  for (i = 0; i < arr.length; i++) {
    hash[arr[i]] = arr[i];
  }
  return hash;
}
