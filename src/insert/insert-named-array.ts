import {
  afterLastElementPos,
  aroundElementPos,
  CollectionInsert,
  ensurePrefixComma,
  ensureSuffixComma,
  getInsertPosNum,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { insertCode } from './modify-code';
import { findVariableDeclaration } from './find';
import { Tree } from '@nrwl/devkit';

import { ArrayLiteralExpression, SourceFile } from 'typescript';
export interface InsertArrayOptions {
  id: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertArrayTreeOptions extends InsertArrayOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertIntoArray = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { node, codeToInsert, insert, indexAdj } = opts;
  insert = insert || {};
  const { abortIfFound } = insert;
  if (abortIfFound && abortIfFound(node)) {
    return;
  }
  const elements = node.elements;
  const count = elements.length;

  let insertPosNum =
    getInsertPosNum({
      type: 'array',
      node,
      elements,
      insert,
      count,
    }) || 0;
  if (count === 0) {
    let insertPosition = node.getStart() + 1;
    insertPosition += indexAdj || 0;
    const code = ensureSuffixComma(codeToInsert);
    return insertCode(srcNode, insertPosition, code);
  }
  if (insertPosNum === -1) {
    insertPosNum = 0;
    insert.relative = 'before';
  }

  let insertPosition =
    insertPosNum >= count
      ? afterLastElementPos(elements)
      : aroundElementPos(elements, insertPosNum, insert.relative);

  const shouldInsertAfter =
    insertPosNum === count || insert.relative === 'after';
  const code = shouldInsertAfter
    ? ensurePrefixComma(codeToInsert)
    : ensureSuffixComma(codeToInsert);

  insertPosition += indexAdj || 0;
  return insertCode(srcNode, insertPosition, code);
};

export const insertInArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, codeToInsert, insert } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ArrayLiteralExpression;
    const newTxt = insertIntoArray(srcNode, {
      node,
      codeToInsert,
      insert,
    });
    return newTxt;
  };

export function insertIntoNamedArrayInFile(
  filePath: string,
  opts: InsertArrayOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.id);
  return replaceInFile(filePath, {
    ...opts,
    findNodeFn,
    modifyFn: insertInArray,
  });
}

export function insertIntoNamedArrayInTree(
  tree: Tree,
  opts: InsertArrayTreeOptions,
) {
  return modifyTree(tree, opts);
}