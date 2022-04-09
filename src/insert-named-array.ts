import {
  afterLastElementPos,
  beforeElementPos,
  ensurePrefixComma,
  ensureSuffixComma,
  getInsertPosNum,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { insertCode } from './insert-code';
import { findVariableDeclaration } from './find';
import { Tree } from '@nrwl/devkit';

import { ArrayLiteralExpression, SourceFile } from 'typescript';

type ArrayPosition = 'start' | 'end' | number;

export interface InsertArrayOptions {
  id: string;
  codeToInsert: string;
  insertPos?: ArrayPosition;
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
  let { literalExpr, codeToInsert, insertPos, indexAdj } = opts;
  const literals = literalExpr.elements;
  const litCount = literals.length;
  let insertPosNum = getInsertPosNum(insertPos, litCount) || 0;

  if (litCount === 0) {
    const insertPosition = literalExpr.getStart() + 1;
    return insertCode(srcNode, insertPosition, codeToInsert);
  }
  const code =
    insertPosNum === litCount
      ? ensurePrefixComma(codeToInsert)
      : ensureSuffixComma(codeToInsert);

  let insertPosition =
    insertPosNum >= litCount
      ? afterLastElementPos(literals)
      : beforeElementPos(literals, insertPosNum);
  insertPosition += indexAdj || 0;
  return insertCode(srcNode, insertPosition, code);
};

export const insertInArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, codeToInsert, insertPos } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const literalExpr = declaration.initializer as ArrayLiteralExpression;
    const newTxt = insertIntoArray(srcNode, {
      literalExpr,
      codeToInsert,
      insertPos,
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
