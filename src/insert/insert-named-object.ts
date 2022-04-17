import { CollectionInsert, insertIntoNode } from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';
import { SourceFile } from 'typescript';
import { ObjectLiteralExpression } from 'typescript';
import { AnyOpts, replaceInFile, modifyTree, replaceInSource } from '../modify';

export interface InsertObjectOptions {
  varId: string;
  code: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertObjectTreeOptions extends InsertObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export type InsertInObjectFn = {
  id: string;
  code: string;
  insert: CollectionInsert;
  indexAdj?: number;
};

export const insertInObject =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { varId, code, insert } = opts;
    const declaration = findVariableDeclaration(srcNode, varId);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ObjectLiteralExpression;
    return insertIntoNode(srcNode, {
      elementsField: 'properties',
      node,
      code,
      insert,
    });
  };

export function insertIntoNamedObjectInSource(
  source: string,
  opts: InsertObjectOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.varId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertInObject,
    ...opts,
  });
}

export function insertIntoNamedObjectInFile(
  filePath: string,
  opts: InsertObjectOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.varId);
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
