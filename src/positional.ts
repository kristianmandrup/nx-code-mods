import { Identifier, Node, PropertyAssignment } from 'typescript';

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
    if (!node) {
      console.log('no matching element found');
      return;
    }

    let index = -1;
    elements.find((el, idx) => {
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

export type CollectionInsert = {
  index?: CollectionIndex;
  findElement?: FindChildNode;
  abortIfFound?: CheckUnderNode;
  relative?: BeforeOrAfter;
};

export type BeforeOrAfter = 'before' | 'after';

export const afterLastElementPos = (literals: any[]) =>
  literals[literals.length - 1].getEnd();

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
