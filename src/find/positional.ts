import { findStringLiteral, findIdentifier } from './find';
import { Node, NodeArray } from 'typescript';

type ElementsType = any[] | NodeArray<any>;

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

export const findElementNode = ({
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

export type FindChildNode = (node: Node) => Node | undefined;

export type CheckUnderNode = (node: Node) => boolean | undefined;

export type FindElementFn = FindChildNode | string;

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
