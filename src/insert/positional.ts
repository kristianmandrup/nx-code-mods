import { FindElementFn, CheckUnderNode, findElementNode } from '../find';
import { Node, NodeArray } from 'typescript';

type ElementsType = any[] | NodeArray<any>;

export type InsertPosNumParams = {
  node: Node;
  elements: ElementsType;
  insert: CollectionInsert;
  count: number;
};

export const getInsertPosNum = ({
  node,
  elements,
  insert,
  count,
}: InsertPosNumParams) => {
  let { findElement, index } = insert;
  if (findElement) {
    return findElementNode({ node, elements, findElement });
  }
  index = index || 'start';
  if (Number.isInteger(index)) {
    let insertPosNum = parseInt('' + index);
    if (insertPosNum <= 0 || insertPosNum >= count) {
      throw new Error(`insertIntoArray: Invalid insertPos ${index} argument`);
    }
    return insertPosNum;
  }
  if (index === 'start') {
    return 0;
  }
  if (index === 'end') {
    return count;
  }
  return;
};

export type CollectionInsertIndex = 'start' | 'end' | number;

export type CollectionInsert = {
  index?: CollectionInsertIndex;
  findElement?: FindElementFn;
  abortIfFound?: CheckUnderNode;
  relative?: InsertRelativePos;
};

type BetweenPos = {
  startPos: number;
  endPos: number;
};

export type InsertRelativePos = 'before' | 'after';

export const afterLastElementPos = (elements: ElementsType) =>
  elements[elements.length - 1].getEnd();

export const aroundElementPos = (
  elements: ElementsType,
  pos: number,
  relativePos: InsertRelativePos,
) => {
  const element = elements[pos];
  return relativePos === 'after' ? element.getEnd() : element.getStart();
};

export const getNextElem = (elements: ElementsType, pos: number) => {
  const index = pos + 1 >= elements.length ? elements.length - 1 : pos + 1;
  return elements[index];
};
