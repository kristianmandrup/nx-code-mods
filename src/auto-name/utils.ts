import { Identifier, StringLiteral, Node } from 'typescript';
import { findAllIdentifiersFor, findAllStringLiteralsFor } from '../find';
import * as inflection from 'inflection';
export const camelizedIdentifier = (parts: string[]) =>
  inflection.camelize(parts.join('_'), true);

export const idToStr = (id: Identifier | StringLiteral): string => {
  return id.text ? id.text : ((id as Identifier).escapedText as string);
};

type IdLike = Identifier | StringLiteral;

export const sortByPosition = (nodeList: any[]) =>
  nodeList.sort((idA: any, idB: any) => idA.pos - idB.pos);

export const findNodeIds = (node: Node): string[] => {
  const ids: Identifier[] = findAllIdentifiersFor(node);
  const strLits: StringLiteral[] = findAllStringLiteralsFor(node);
  const allIds: IdLike[] = [...ids, ...strLits];
  const orderedIds = sortByPosition(allIds);
  return orderedIds.map((id) => idToStr(id as IdLike));
};

export function arrToObject(arr: string[]) {
  var i,
    hash: any = {};
  for (i = 0; i < arr.length; i++) {
    hash[arr[i]] = arr[i];
  }
  return hash;
}
