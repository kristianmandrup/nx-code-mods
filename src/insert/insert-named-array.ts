import { CollectionInsert, insertIntoNode } from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree, replaceInSource } from '../modify';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';

import { ArrayLiteralExpression, SourceFile } from 'typescript';
export interface InsertArrayOptions {
  varId: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}

export interface ApiInsertArrayOptions {
  varId?: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}
export interface InsertArrayTreeOptions extends InsertArrayOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertInArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, code, insert } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ArrayLiteralExpression;
    return insertIntoNode(srcNode, {
      elementsField: 'elements',
      node,
      code,
      insert,
    });
  };

export function insertIntoNamedArrayInSource(
  source: string,
  opts: InsertArrayOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.varId);
  return replaceInSource(source, {
    ...opts,
    findNodeFn,
    modifyFn: insertInArray,
  });
}

export function insertIntoNamedArrayInFile(
  filePath: string,
  opts: InsertArrayOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.varId);
  return replaceInFile(filePath, {
    ...opts,
    findNodeFn,
    modifyFn: insertInArray,
  });
}

export async function insertIntoNamedArrayInTree(
  tree: Tree,
  opts: InsertArrayTreeOptions,
) {
  return await modifyTree(tree, opts);
}
