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

export const humanize = (str: string) => {
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
