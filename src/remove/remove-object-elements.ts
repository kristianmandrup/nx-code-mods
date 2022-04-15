import { CollectionRemove, removeFromNode, RemoveIndexAdj } from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from '../modify';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';
import { ObjectLiteralExpression, SourceFile } from 'typescript';

export interface RemoveObjectOptions {
  id: string;
  remove?: CollectionRemove;
  indexAdj?: RemoveIndexAdj;
}

export interface RemoveObjectTreeOptions extends RemoveObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export type RemoveInObjectFn = {
  id: string;
  codeToRemove: string;
  insert: CollectionRemove;
  indexAdj?: number;
};

export const removeFromObject =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ObjectLiteralExpression;
    const newTxt = removeFromNode(srcNode, {
      type: 'object',
      elementsField: 'properties',
      node,
      ...opts,
    });
    return newTxt;
  };

export function removeFromNamedObjectInFile(
  filePath: string,
  opts: RemoveObjectOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.id);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeFromObject,
    ...opts,
  });
}

export function removeFromNamedObjectInTree(
  tree: Tree,
  opts: RemoveObjectTreeOptions,
) {
  return modifyTree(tree, opts);
}
