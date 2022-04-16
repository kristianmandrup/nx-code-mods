import {
  afterLastElementPos,
  aroundElementPos,
  CollectionInsert,
  getInsertPosNum,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';
import { SourceFile } from 'typescript';
import { ObjectLiteralExpression } from 'typescript';
import { insertCode, AnyOpts, replaceInFile, modifyTree } from '../modify';
import { ensurePrefixComma, ensureSuffixComma } from '../ensure';

export interface InsertObjectOptions {
  id: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertObjectTreeOptions extends InsertObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertIntoObject = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { node, codeToInsert, insert, indexAdj } = opts;
  insert = insert || {};
  const { abortIfFound } = insert;
  if (abortIfFound && abortIfFound(node)) {
    return;
  }
  const elements = node.properties;
  const count = elements.length;
  let insertPosNum =
    getInsertPosNum({
      node,
      elements,
      insert,
      count,
    }) || 0;
  if (count === 0) {
    let insertPosition = node.getStart() + 1;
    insertPosition += indexAdj || 0;
    const code = codeToInsert; // ensureSuffixComma(codeToInsert);
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

export type InsertInObjectFn = {
  id: string;
  codeToInsert: string;
  insert: CollectionInsert;
  indexAdj?: number;
};

export const insertInObject =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, codeToInsert, insert } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ObjectLiteralExpression;
    const newTxt = insertIntoObject(srcNode, {
      node,
      codeToInsert,
      insert,
    });
    return newTxt;
  };

export function insertIntoNamedObjectInFile(
  filePath: string,
  opts: InsertObjectOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.id);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertInObject,
    ...opts,
  });
}

export async function insertIntoNamedObjectInTree(
  tree: Tree,
  opts: InsertObjectTreeOptions,
) {
  return await modifyTree(tree, opts);
}
