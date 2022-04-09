import { Node } from 'typescript';

export type InsertPosNumParams = {
  literalExpr: Node;
  elements: any[];
  insert: CollectionInsert;
  count: number;
};

export const getInsertPosNum = ({
  literalExpr,
  elements,
  insert,
  count,
}: InsertPosNumParams) => {
  let { findElement, index } = insert;
  if (findElement) {
    const node = findElement(literalExpr);
    return elements.indexOf(node);
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

export type CollectionInsert = {
  index?: CollectionIndex;
  findElement?: FindChildNode;
  relative?: BeforeOrAfter;
};

export type BeforeOrAfter = 'before' | 'after';

export const afterLastElementPos = (literals: any[]) =>
  literals[literals.length - 1].getEnd();

export const beforeElementPos = (literals: any[], pos: number) =>
  literals[pos].getStart();

export const ensurePrefixComma = (codeToInsert: string) =>
  codeToInsert.match(/^\s*,/) ? codeToInsert : ',' + codeToInsert;

export const ensureSuffixComma = (codeToInsert: string) =>
  codeToInsert.match(/\s*,$/) ? codeToInsert : codeToInsert + ',';
