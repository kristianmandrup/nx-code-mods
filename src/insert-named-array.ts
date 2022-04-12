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
  let { literalExpr, codeToInsert, insert, indexAdj } = opts;
  insert = insert || {};
  const { abortIfFound } = insert;
  if (abortIfFound && abortIfFound(literalExpr)) {
    return;
  }
  const literals = literalExpr.elements;
  const litCount = literals.length;

  let insertPosNum =
    getInsertPosNum({
      type: 'array',
      node: literalExpr,
      elements: literals,
      insert,
      count: litCount,
    }) || 0;
  if (litCount === 0) {
    let insertPosition = literalExpr.getStart() + 1;
    insertPosition += indexAdj || 0;
    const code = ensureSuffixComma(codeToInsert);
    return insertCode(srcNode, insertPosition, code);
  }
  if (insertPosNum === -1) {
    insertPosNum = 0;
    insert.relative = 'before';
  }

  let insertPosition =
    insertPosNum >= litCount
      ? afterLastElementPos(literals)
      : aroundElementPos(literals, insertPosNum, insert.relative);

  const shouldInsertAfter =
    insertPosNum === litCount || insert.relative === 'after';
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
    const literalExpr = declaration.initializer as ArrayLiteralExpression;
    const newTxt = insertIntoArray(srcNode, {
      literalExpr,
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
