import {
  afterLastElementPos,
  afterLastElementRemovePos,
  aroundElementPos,
  CollectionRemove,
  getElementRemovePositions,
  getRemovePosNum,
  RemoveIndexAdj,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { removeCode } from './modify-code';
import { findVariableDeclaration } from './find';
import { Tree } from '@nrwl/devkit';
import { SourceFile } from 'typescript';
import { ObjectLiteralExpression } from 'typescript';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';

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
  let { literalExpr, remove, indexAdj } = opts;
  const elements = literalExpr.properties;
  const count = elements.length;
  let removePosNum =
    getRemovePosNum({
      type: 'object',
      node: literalExpr,
      elements,
      remove,
      count,
    }) || 0;
  if (count === 0) {
    const startPos = literalExpr.getStart() + indexAdj.start;
    const endPos = literalExpr.getEnd() + indexAdj.end;
    return removeCode(srcNode, { startPos, endPos });
  }
  if (removePosNum === -1) {
    removePosNum = 0;
    remove.relative = 'before';
  }

  let positions =
    removePosNum >= count
      ? afterLastElementRemovePos(elements)
      : getElementRemovePositions(elements, removePosNum, remove.relative);

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
    const literalExpr = declaration.initializer as ObjectLiteralExpression;
    const newTxt = removePropsFromObject(srcNode, {
      literalExpr,
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
