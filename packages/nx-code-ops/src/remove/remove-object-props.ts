import { CollectionModifyOpts, removeFromNode } from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree, replaceInSource } from '../modify';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';
import { ObjectLiteralExpression, SourceFile } from 'typescript';
import { IndexAdj } from '../types';

export interface RemoveObjectOptions {
  varId: string;
  remove?: CollectionModifyOpts;
  indexAdj?: IndexAdj;
}

export interface ApiRemoveObjectOptions {
  varId?: string;
  remove?: CollectionModifyOpts;
  indexAdj?: IndexAdj;
}
export interface RemoveObjectTreeOptions extends RemoveObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export type RemoveInObjectFn = {
  id: string;
  remove: CollectionModifyOpts;
  indexAdj?: number;
};

export const removeFromObject =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { varId } = opts;
    const declaration = findVariableDeclaration(srcNode, varId);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ObjectLiteralExpression;
    return removeFromNode(srcNode, {
      elementsField: 'properties',
      node,
      ...opts,
    });
  };

const defaultOpts = {
  comma: true,
  modifyFn: removeFromObject,
};

export function removeFromNamedObjectInSource(
  sourceCode: string,
  opts: RemoveObjectOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.varId);
  return replaceInSource(sourceCode, {
    ...defaultOpts,
    findNodeFn,
    ...opts,
  });
}

export function removeFromNamedObjectInFile(
  filePath: string,
  opts: RemoveObjectOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.varId);
  return replaceInFile(filePath, {
    ...defaultOpts,
    findNodeFn,
    ...opts,
  });
}

export async function removeFromNamedObjectInTree(
  tree: Tree,
  opts: RemoveObjectTreeOptions,
) {
  return await modifyTree(tree, opts);
}
