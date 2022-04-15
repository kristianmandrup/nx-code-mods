import {
  CollectionRemove,
  firstElementRemovePos,
  getPositions,
  getRemovePosNum,
  getRemovePosRange,
  lastElementRemovePos,
  midElementRemovePos,
  normalizeRemoveIndexAdj,
  RemoveIndexAdj,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import {
  AnyOpts,
  replaceInFile,
  modifyTree,
  removeCode,
  replaceCode,
} from '../modify';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';
import { SourceFile } from 'typescript';
import { ObjectLiteralExpression } from 'typescript';

export interface RemoveObjectOptions {
  id: string;
  remove?: CollectionRemove;
  indexAdj?: RemoveIndexAdj;
}

export interface RemoveObjectTreeOptions extends RemoveObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removePropsFromObject = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  const type = 'object';
  let { node, remove, replacementCode, indexAdj } = opts;
  remove = remove || {};
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  const elements = node.properties;
  const count = elements.length;

  const posOpts = {
    ...opts,
    type,
    srcNode,
    elements,
    count,
    indexAdj,
  };
  const positions = getPositions(posOpts) || getRemovePosRange(posOpts);

  positions.startPos += indexAdj.start;
  positions.endPos += indexAdj.end;

  if (replacementCode) {
    return replaceCode(srcNode, { ...positions, code: replacementCode });
  }
  return removeCode(srcNode, positions);
};

export type RemoveInObjectFn = {
  id: string;
  codeToRemove: string;
  insert: CollectionRemove;
  indexAdj?: number;
};

export const removeFromObject =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, remove } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ObjectLiteralExpression;
    const newTxt = removePropsFromObject(srcNode, {
      node,
      remove,
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
