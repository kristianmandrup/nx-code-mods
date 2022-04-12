import {
  afterLastElementPos,
  afterLastElementRemovePos,
  aroundElementPos,
  CollectionRemove,
  getElementRemovePositions,
  getRemovePosNum,
  normalizeRemoveIndexAdj,
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
  let { node, remove, indexAdj } = opts;
  remove = remove || {};
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  const elements = node.properties;
  const count = elements.length;
  let removePosNum =
    getRemovePosNum({
      type: 'object',
      node,
      elements,
      remove,
      count,
    }) || 0;
  if (count === 0) {
    const positions = {
      startPos: node.getStart() + 1 + indexAdj.start,
      endPos: node.getEnd() - 1 + indexAdj.end,
    };
    return removeCode(srcNode, positions);
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
    positions.startPos = node.getStart();
  }

  if (!positions.endPos) {
    positions.endPos = node.getEnd();
  }
  positions.startPos += indexAdj.start;
  positions.endPos += indexAdj.end;
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
