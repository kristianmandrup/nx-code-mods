import { findStringLiteral, findIdentifier } from './find';
import { Identifier, Node, NodeArray } from 'typescript';

type ElementsType = any[] | NodeArray<any>;

export type InsertPosNumParams = {
  type: 'array' | 'object';
  node: Node;
  elements: ElementsType;
  insert: CollectionInsert;
  count: number;
};

export type RemovePosNumParams = {
  type: 'array' | 'object';
  node: Node;
  elements: ElementsType;
  remove: CollectionRemove;
  count: number;
};

export const createFindStrLit = (id: string) => (node: Node) =>
  findStringLiteral(node, id);

export const createFindId = (id: string) => (node: Node) =>
  findIdentifier(node, id);

type FindElementNodeParams = {
  node: any;
  elements: ElementsType;
  findElement: FindElementFn;
};

const createMatchElem = (findElement: FindChildNode) => (el: any) => {
  return findElement(el);
};

const findElementNode = ({
  node,
  elements,
  findElement,
}: FindElementNodeParams) => {
  if (typeof findElement === 'string') {
    findElement = createFindId(findElement);
  }
  const foundElem = findElement(node);
  if (!foundElem) {
    return;
  }
  const matchElem = createMatchElem(findElement);
  let index = -1;
  elements.find((el: any, idx: number) => {
    const found = matchElem(el);
    if (found) {
      index = idx;
    }
  });
  return index;
};

export const getInsertPosNum = ({
  // type,
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

export const normalizeRemoveIndexAdj = (indexAdj: RemoveIndexAdj) => {
  indexAdj = indexAdj || {};
  indexAdj.start = indexAdj.start || 0;
  indexAdj.end = indexAdj.end || 0;
  return indexAdj;
};

export const getRemovePosNum = ({
  // type,
  node,
  elements,
  remove,
  count,
}: RemovePosNumParams) => {
  let { findElement, index } = remove || {};
  if (findElement) {
    return findElementNode({ node, elements, findElement });
  }
  index = index || 'first';
  if (Number.isInteger(index)) {
    let insertPosNum = parseInt('' + index);
    if (insertPosNum <= 0 || insertPosNum >= count) {
      throw new Error(`insertIntoArray: Invalid insertPos ${index} argument`);
    }
    return insertPosNum;
  }
  if (index === 'first') {
    return 0;
  }
  if (index === 'last') {
    return count;
  }
  return;
};

export type CollectionInsertIndex = 'start' | 'end' | number;
export type FindChildNode = (node: Node) => Node | undefined;

export type CheckUnderNode = (node: Node) => boolean | undefined;

export type FindElementFn = FindChildNode | string;

export type CollectionRemoveIndex = 'first' | 'last' | number;

export type CollectionInsert = {
  index?: CollectionInsertIndex;
  findElement?: FindElementFn;
  abortIfFound?: CheckUnderNode;
  relative?: BeforeOrAfter;
};

export type CollectionRemove = {
  index?: CollectionRemoveIndex;
  findElement?: FindElementFn;
  relative?: BeforeOrAfter;
};

export type RemoveIndexAdj = {
  start?: number;
  end?: number;
};

export type BeforeOrAfter = 'before' | 'after' | 'replace';

export const afterLastElementPos = (elements: ElementsType) =>
  elements[elements.length - 1].getEnd();

export const afterLastElementRemovePos = (elements: ElementsType) => ({
  startPos: elements[elements.length - 1].getEnd(),
  endPos: undefined,
});

// TODO: add support for 'replace'
export const aroundElementPos = (
  elements: ElementsType,
  pos: number,
  relativePos: BeforeOrAfter,
) => {
  const element = elements[pos];
  return relativePos === 'after' ? element.getEnd() : element.getStart();
};

export const getElementRemovePositions = (
  elements: ElementsType,
  pos: number,
  relativePos: BeforeOrAfter,
) => {
  const element = elements[pos];
  return relativePos === 'after'
    ? { startPos: element.getEnd() }
    : { endPos: element.getStart() };
};

export const ensurePrefixComma = (codeToInsert: string) =>
  codeToInsert.match(/^\s*,/) ? codeToInsert : ',' + codeToInsert;

export const ensureSuffixComma = (codeToInsert: string) =>
  codeToInsert.match(/\s*,$/) ? codeToInsert : codeToInsert + ',';

export const ensureStmtClosing = (codeToInsert: string) => {
  codeToInsert = codeToInsert.match(/;$/) ? codeToInsert : codeToInsert + ';';
  return ensureNewlineClosing(codeToInsert);
};

export const ensureNewlineClosing = (codeToInsert: string) =>
  codeToInsert.match(/\n$/) ? codeToInsert : codeToInsert + '\n';
