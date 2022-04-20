import {
  Node,
  SourceFile,
  ClassDeclaration,
  ParameterDeclaration,
} from 'typescript';
import {
  findClassDeclaration,
  ParamsPos,
  FindElementFn,
  CheckUnderNode,
  findElementNode,
} from '../find';
import { AnyOpts, insertCode } from '../modify';
import {
  createEnsureValidPosition,
  ensureCommaDelimiters,
  ensureStmtClosing,
} from '../ensure';
import {
  afterIndex,
  beforeIndex,
  endOfIndex,
  startOfIndex,
} from '../positional';
import { ElementsType } from '../types';

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

export type InsertRelativePos = 'before' | 'after';

export const insertClassCode = (
  srcNode: SourceFile,
  { index, code, indexAdj }: any,
) => {
  index += indexAdj || 0;
  code = ensureStmtClosing(code);
  return insertCode(srcNode, index, code);
};

export const alternativeClassInsertIndex = (
  classDecl: ClassDeclaration,
  opts: any,
) => {
  const { findAltPivotNode, defaultIndex } = opts;
  const { members } = classDecl;
  if (members.length === 0) {
    return defaultIndex(classDecl);
  }
  const altPivotNode = findAltPivotNode(classDecl);
  if (!altPivotNode) {
    return defaultIndex(classDecl);
  }
  return beforeIndex(altPivotNode);
};

const nodeClassInsertIndex = (node: Node, opts: any) => {
  return opts.nodeIndex(node);
};

export const classInsertIndex = (classDecl: ClassDeclaration, opts: any) => {
  const { firstTypeNode } = opts;
  opts.nodeIndex = opts.nodeIndex || beforeIndex;
  return !firstTypeNode
    ? nodeClassInsertIndex(firstTypeNode, opts)
    : alternativeClassInsertIndex(classDecl, opts);
};

export const insertInClassScope = (srcNode: SourceFile, opts: AnyOpts) => {
  const { findMatchingNode, classId, code, insertPos, propertyId, indexAdj } =
    opts;
  const abortIfFound = (node: any) =>
    findMatchingNode(node, { classId: classId, propertyId });

  const classDecl = findClassDeclaration(srcNode, classId);
  if (!classDecl) return;
  // abort if property with that name already declared in class
  if (abortIfFound) {
    const found = abortIfFound(classDecl);
    if (found) return;
  }

  if (insertPos === 'end') {
    const index = endOfIndex(classDecl);
    return insertClassCode(srcNode, { index, code: code, indexAdj });
  }
  const index = classInsertIndex(classDecl, opts);
  return insertClassCode(srcNode, { index, code: code, indexAdj });
};

export const insertIntoNode = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { bounds, formatCode, elementsField, node, code, insert, indexAdj } =
    opts;
  console.log('insertIntoNode', opts);
  // support special
  const startNodePos = startOfIndex(node);
  const endNodePos = endOfIndex(node);
  const nodeBounds = {
    startPos: startNodePos,
    endPos: endNodePos,
  };

  console.log({ nodeBounds, bounds });
  bounds = {
    ...nodeBounds,
    ...bounds,
  };

  const ensureValidPosition = createEnsureValidPosition(bounds);
  insert = insert || {};
  if (!insert.relative) {
    insert.relative = 'before';
  }

  const { abortIfFound } = insert;
  if (abortIfFound && abortIfFound(node)) {
    return;
  }

  const elements = node[elementsField];
  if (!elements) {
    console.error({ node, elementsField });
    throw new Error(`insertIntoNode: invalid elements field ${elementsField}`);
  }
  const count = elements.length;

  if (count === 0) {
    let pos = bounds.startPos;
    console.log('no elements', { count, pos });
    pos += indexAdj || 0;
    pos = ensureValidPosition(pos);
    const formattedCode = formatCode
      ? formatCode(code, { insert, pos: 0, count })
      : code;
    return insertCode(srcNode, pos, formattedCode);
  }

  let elemPos =
    getInsertPosNum({
      node,
      elements,
      insert,
      count,
    }) || 0;

  formatCode = formatCode || ensureCommaDelimiters;

  if (elemPos === -1) {
    elemPos = 0;
  }

  let insertPos =
    elemPos >= count
      ? afterLastElementPos(elements)
      : aroundElementPos(elements, elemPos, insert.relative);

  console.log({ elements, elemPos, insertPos });
  const formattedCode = formatCode(code, { insert, pos: elemPos, count });
  insertPos += indexAdj || 0;
  insertPos = ensureValidPosition(insertPos);
  return insertCode(srcNode, insertPos, formattedCode);
};

export const afterLastElementPos = (elements: ElementsType) => {
  const lastElem = elements[elements.length - 1];
  return afterIndex(lastElem);
};

export const aroundElementPos = (
  elements: ElementsType,
  pos: number,
  relativePos: InsertRelativePos,
) => {
  const element = elements[pos];
  return relativePos === 'after' ? afterIndex(element) : beforeIndex(element);
};

export const getNextElem = (elements: ElementsType, pos: number) => {
  const index = pos + 1 >= elements.length ? elements.length - 1 : pos + 1;
  return elements[index];
};
