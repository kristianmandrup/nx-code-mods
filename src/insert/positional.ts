import { findClassDeclaration } from './../find/find';
import { Node, NodeArray, SourceFile, ClassDeclaration } from 'typescript';
import { FindElementFn, CheckUnderNode, findElementNode } from '../find';
import { AnyOpts, insertCode } from '../modify';
import { ensureCommaDelimiters, ensureStmtClosing } from '../ensure';

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

export type InsertRelativePos = 'before' | 'after';

export const insertClassCode = (
  srcNode: SourceFile,
  { index, code, indexAdj }: any,
) => {
  index += indexAdj || 0;
  code = ensureStmtClosing(code);
  return insertCode(srcNode, index, code);
};

export const endOfIndex = (node: Node) => {
  return node.getEnd() - 1;
};

export const startOfIndex = (node: Node) => {
  return node.getStart() + 1;
};

export const beforeIndex = (node: Node) => {
  return node.getStart() - 1;
};

export const afterIndex = (node: Node) => {
  return node.getEnd() + 1;
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
  const {
    findMatchingNode,
    classId,
    codeToInsert,
    insertPos,
    propId,
    indexAdj,
  } = opts;
  const abortIfFound = (node: any) =>
    findMatchingNode(node, { classId: classId, propId });

  const classDecl = findClassDeclaration(srcNode, classId);
  if (!classDecl) return;
  // abort if property with that name already declared in class
  if (abortIfFound) {
    const found = abortIfFound(classDecl);
    if (found) return;
  }

  if (insertPos === 'end') {
    const index = endOfIndex(classDecl);
    return insertClassCode(srcNode, { index, code: codeToInsert, indexAdj });
  }
  const index = classInsertIndex(classDecl, opts);
  return insertClassCode(srcNode, { index, code: codeToInsert, indexAdj });
};

export const insertIntoNode = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { formatCode, elementsField, node, codeToInsert, insert, indexAdj } =
    opts;
  formatCode = formatCode || ensureCommaDelimiters;
  insert = insert || {};
  const { abortIfFound } = insert;
  if (abortIfFound && abortIfFound(node)) {
    return;
  }
  const elements = node[elementsField];
  const count = elements.length;
  let insertPosNum =
    getInsertPosNum({
      node,
      elements,
      insert,
      count,
    }) || 0;
  if (count === 0) {
    let pos = node.getStart() + 1;
    pos += indexAdj || 0;
    const code = codeToInsert; // ensureSuffixComma(codeToInsert);
    return insertCode(srcNode, pos, code);
  }
  if (insertPosNum === -1) {
    insertPosNum = 0;
    insert.relative = 'before';
  }

  let pos =
    insertPosNum >= count
      ? afterLastElementPos(elements)
      : aroundElementPos(elements, insertPosNum, insert.relative);

  const code = formatCode(codeToInsert, { insert, pos, count });
  pos += indexAdj || 0;
  return insertCode(srcNode, pos, code);
};

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
