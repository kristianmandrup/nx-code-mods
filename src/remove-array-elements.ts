import {
  afterLastElementRemovePos,
  CollectionRemove,
  getElementRemovePositions,
  getRemovePosNum,
  RemoveIndexAdj,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { removeCode } from './modify-code';
import { findVariableDeclaration } from './find';
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

export const removeElementsFromArray = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { node, remove, indexAdj } = opts;
  remove = remove || {};
  const elements = node.elements;
  const count = elements.length;

  let posNum =
    getRemovePosNum({
      type: 'array',
      node,
      elements,
      remove,
      count,
    }) || 0;
  if (count === 0) {
    const startPos = node.getStart() + indexAdj.start;
    const endPos = node.getEnd() + indexAdj.end;
    return removeCode(srcNode, { startPos, endPos });
  }
  if (posNum === -1) {
    posNum = 0;
    remove.relative = 'before';
  }

  let positions =
    posNum >= count
      ? afterLastElementRemovePos(elements)
      : getElementRemovePositions(elements, posNum, remove.relative);

  if (!positions.startPos) {
    positions.startPos = node.getStart();
  }

  if (!positions.endPos) {
    positions.endPos = node.getEnd();
  }
  positions.startPos += indexAdj.start || 0;
  positions.endPos += indexAdj.end || 0;
  return removeCode(srcNode, positions);
};

export const removeFromArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ArrayLiteralExpression;
    const newTxt = removeElementsFromArray(srcNode, {
      node,
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
