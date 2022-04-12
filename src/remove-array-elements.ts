import {
  afterLastElementPos,
  aroundElementPos,
  CollectionRemove,
  getRemovePosNum,
  RemoveIndexAdj,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { insertCode, removeCode } from './modify-code';
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
  let { literalExpr, remove, indexAdj } = opts;
  remove = remove || {};
  const literals = literalExpr.elements;
  const litCount = literals.length;

  let insertPosNum =
    getRemovePosNum({
      type: 'array',
      node: literalExpr,
      elements: literals,
      remove,
      count: litCount,
    }) || 0;
  if (litCount === 0) {
    const startPos = literalExpr.getStart() + indexAdj.start;
    const endPos = literalExpr.getEnd() + indexAdj.end;
    return removeCode(srcNode, { startPos, endPos });
  }
  if (insertPosNum === -1) {
    insertPosNum = 0;
    remove.relative = 'before';
  }

  let positions =
    insertPosNum >= litCount
      ? afterLastElementPos(literals)
      : aroundElementPos(literals, insertPosNum, remove.relative);

  if (!positions.startPos) {
    positions.startPos = literalExpr.getStart();
  }

  if (!positions.endPos) {
    positions.endPos = literalExpr.getEnd();
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
    const literalExpr = declaration.initializer as ArrayLiteralExpression;
    const newTxt = removeElementsFromArray(srcNode, {
      literalExpr,
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
