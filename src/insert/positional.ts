import { Node, SourceFile, ClassDeclaration } from 'typescript';
import {
  findClassDeclaration,
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
import { ElementsType, PositionBounds } from '../types';

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
  insert = insert || {};
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
  return firstTypeNode
    ? nodeClassInsertIndex(firstTypeNode, opts)
    : alternativeClassInsertIndex(classDecl, opts);
};

export const insertInClassScope = (srcNode: SourceFile, opts: AnyOpts) => {
  const {
    getFirstTypeNode,
    findMatchingNode,
    classId,
    code,
    insertPos,
    propertyId,
    indexAdj,
  } = opts;
  const abortIfFound = (node: any) =>
    findMatchingNode(node, { classId: classId, propertyId });

  const classDecl = findClassDeclaration(srcNode, classId);
  if (!classDecl) return;
  // abort if property with that name already declared in class
  if (abortIfFound) {
    const found = abortIfFound(classDecl);
    if (found) return;
  }

  const firstTypeNode = getFirstTypeNode(classDecl);
  opts.firstTypeNode = firstTypeNode;

  if (insertPos === 'end') {
    const index = endOfIndex(classDecl);
    return insertClassCode(srcNode, { index, ...opts });
  }
  const index = classInsertIndex(classDecl, opts);
  return insertClassCode(srcNode, { index, ...opts });
};

const insertPosBounds = (node: any, bounds: PositionBounds) => {
  const startNodePos = startOfIndex(node);
  const endNodePos = endOfIndex(node);
  const nodeBounds = {
    startPos: startNodePos,
    endPos: endNodePos,
  };
  return {
    ...nodeBounds,
    ...bounds,
  };
};

const normalizeInsert = (insert: any = {}) => {
  if (!insert.relative) {
    insert.relative = 'before';
  }
  return insert;
};

export const boundsInsertPos = (bounds: any) => bounds.startPos;

export const calcPosNoElements = (bounds: any, opts: any) => {
  const { ensureValidPosition, indexAdj, validatePos } = opts;
  let pos = boundsInsertPos(bounds);
  pos += indexAdj || 0;
  if (validatePos) {
    pos = ensureValidPosition(pos);
  }
  return pos;
};

export const insertIntoNoElements = (srcNode: any, opts: any) => {
  const {
    calcPosNoElements,
    boundsInsertPos,
    bounds,
    code,
    formatCode,
    insert,
    count,
  } = opts;
  if (count > 0) return;
  // insert decorator at start of param!?
  let pos = boundsInsertPos(bounds);
  pos = calcPosNoElements(bounds, opts);
  const formattedCode = formatCode
    ? formatCode(code, { insert, pos: 0, count })
    : code;
  return insertCode(srcNode, pos, formattedCode);
};

export const insertIntoElements = (srcNode: any, opts: any) => {
  const {
    ensureValidPosition,
    afterLastElementPos,
    aroundElementPos,
    validatePos,
  } = opts;
  let { node, elements, insert, count, formatCode, indexAdj, code } = opts;
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

  const formattedCode = formatCode(code, { insert, pos: elemPos, count });
  insertPos += indexAdj || 0;
  if (validatePos) {
    insertPos = ensureValidPosition(insertPos);
  }
  return insertCode(srcNode, insertPos, formattedCode);
};

const insertPositional = (srcNode: any, opts: any) => {
  const { insertIntoNoElements, insertIntoElements } = opts;
  return (
    insertIntoNoElements(srcNode, opts) || insertIntoElements(srcNode, opts)
  );
};

export const setInsertFunctions = (opts: any) => {
  opts.insertPositional = opts.insertPositional || insertPositional;
  opts.insertIntoNoElements = opts.insertIntoNoElements || insertIntoNoElements;
  opts.insertIntoElements = opts.insertInElements || insertIntoElements;
  opts.afterLastElementPos = opts.afterLastElementPos || afterLastElementPos;
  opts.aroundElementPos = opts.aroundElementPos || aroundElementPos;
  opts.boundsInsertPos = opts.boundsInsertPos || boundsInsertPos;
  opts.calcPosNoElements = opts.calcPosNoElements || calcPosNoElements;
  return opts;
};

export const insertIntoNode = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { bounds, elementsField, node, insert } = opts;
  opts = setInsertFunctions(opts);
  insert = normalizeInsert(insert);
  opts.insert = insert;
  const { insertPositional } = opts;

  const { abortIfFound } = insert;
  if (abortIfFound && abortIfFound(node)) {
    return;
  }

  bounds = insertPosBounds(node, bounds);
  const elements = node[elementsField];

  const count = elements ? elements.length : 0;

  const ensureValidPosition = createEnsureValidPosition(bounds);
  opts = {
    ...opts,
    ensureValidPosition,
    bounds,
    count,
    elements,
  };
  return insertPositional(srcNode, opts);
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
