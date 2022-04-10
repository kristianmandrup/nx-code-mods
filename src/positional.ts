import { FindNodeFn } from './modify-file';
import { findStringLiteral, findIdentifier } from './find';
import { Identifier, Node, PropertyAssignment } from 'typescript';

export type InsertPosNumParams = {
  type: 'array' | 'object';
  literalExpr: Node;
  elements: any[];
  insert: CollectionInsert;
  count: number;
};

export const createFindStrLit = (id: string) => (node: Node) =>
  findStringLiteral(node, id);

export const createFindId = (id: string) => (node: Node) =>
  findIdentifier(node, id);

type FindElementNodeParams = {
  literalExpr: any;
  elements: any[];
  findElement: FindElementFn;
};

const findElementNode = ({
  literalExpr,
  elements,
  findElement,
}: FindElementNodeParams) => {
  if (typeof findElement === 'string') {
    findElement = createFindId(findElement);
  }
  const node = findElement(literalExpr);
  if (!node) {
    console.log('no matching element found');
    return;
  }

  let index = -1;
  elements.find((el: any, idx: number) => {
    if (el.kind === 294) {
      const pa = el as PropertyAssignment;
      const id = node as Identifier;
      console.log({ pa, id });
      if (pa.name === id) {
        index = idx;
      }
    } else {
      if (el === node) {
        index = idx;
      }
    }
  });
  return index >= 0 ? index : undefined;
};

export const getInsertPosNum = ({
  // type,
  literalExpr,
  elements,
  insert,
  count,
}: InsertPosNumParams) => {
  let { findElement, index } = insert;
  if (findElement) {
    return findElementNode({ literalExpr, elements, findElement });
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

export type CollectionIndex = 'start' | 'end' | number;
export type FindChildNode = (node: Node) => Node | undefined;

export type CheckUnderNode = (node: Node) => boolean | undefined;

export type FindElementFn = FindChildNode | string;

export type CollectionInsert = {
  index?: CollectionIndex;
  findElement?: FindElementFn;
  abortIfFound?: CheckUnderNode;
  relative?: BeforeOrAfter;
};

export type BeforeOrAfter = 'before' | 'after' | 'replace';

export const afterLastElementPos = (literals: any[]) =>
  literals[literals.length - 1].getEnd();

// TODO: add support for 'replace'
export const aroundElementPos = (
  literals: any[],
  pos: number,
  relativePos: BeforeOrAfter,
) =>
  relativePos === 'after' ? literals[pos].getEnd() : literals[pos].getStart();

export const ensurePrefixComma = (codeToInsert: string) =>
  codeToInsert.match(/^\s*,/) ? codeToInsert : ',' + codeToInsert;

export const ensureSuffixComma = (codeToInsert: string) =>
  codeToInsert.match(/\s*,$/) ? codeToInsert : codeToInsert + ',';

export const ensureStmtClosing = (codeToInsert: string) =>
  codeToInsert.match(/;$/) ? codeToInsert : codeToInsert + ';\n';

export const ensureNewlineClosing = (codeToInsert: string) =>
  codeToInsert.match(/\n$/) ? codeToInsert : codeToInsert + '\n';
