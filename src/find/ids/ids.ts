import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, Node, StringLiteral } from 'typescript';
import { sortByPosition } from '../positional';
import { findAllStringLiteralsFor } from '../literals';

export type IdLike = Identifier | StringLiteral;

export const idToStr = (id: Identifier | StringLiteral): string => {
  return id.text ? id.text : ((id as Identifier).escapedText as string);
};

export const findNodeIds = (node: Node): string[] => {
  const ids: IdLike[] = findAllIdentifiersOrStringLiteralsFor(node);
  return ids.map(idToStr);
};

export const findIdentifier = (
  node: Node,
  id: string,
): Identifier | undefined => {
  if (!id) {
    throw Error('findIdentifier: missing id');
  }
  const selector = `Identifier[name='${id}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as Identifier;
};

export const findFirstIdentifier = (node: Node): Identifier | undefined => {
  const selector = `Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as Identifier;
};

export const findLastIdentifier = (node: Node): Identifier | undefined => {
  const selector = `Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[result.length - 1] as Identifier;
};

export const findAllIdentifiersOrStringLiteralsFor = (node: Node): IdLike[] => {
  const ids = findAllIdentifiersFor(node);
  const strLits = findAllStringLiteralsFor(node);
  const allIds = [...ids, ...strLits];
  const sortedIds = sortByPosition(allIds);
  return sortedIds;
};

export const findAllIdentifiersFor = (node: Node): Identifier[] => {
  const selector = `Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};
