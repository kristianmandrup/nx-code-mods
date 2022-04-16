import { removeFromNode, CollectionRemove, RemoveIndexAdj } from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from '../modify';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';
import { ArrayLiteralExpression, SourceFile } from 'typescript';
export interface RemoveArrayOptions {
  id: string;
  remove?: CollectionRemove;
  indexAdj?: RemoveIndexAdj;
}

export interface RemoveArrayTreeOptions extends RemoveArrayOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeFromArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ArrayLiteralExpression;
    const newTxt = removeFromNode(srcNode, {
      elementsField: 'elements',
      node,
      ...opts,
    });
    return newTxt;
  };

export function removeFromNamedArrayInFile(
  filePath: string,
  opts: RemoveArrayOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.id);
  return replaceInFile(filePath, {
    ...opts,
    findNodeFn,
    modifyFn: removeFromArray,
  });
}

export function removeFromNamedArrayInTree(
  tree: Tree,
  opts: RemoveArrayTreeOptions,
) {
  return modifyTree(tree, opts);
}
