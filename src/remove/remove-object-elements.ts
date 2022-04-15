import {
  CollectionRemove,
  firstElementRemovePos,
  getRemovePosNum,
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
  let { node, remove, replacementCode, indexAdj } = opts;
  remove = remove || {};
  const { relative } = remove;
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  const elements = node.properties;
  const count = elements.length;
  let pos =
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
  if (pos === -1) {
    pos = 0;
    remove.relative = 'at';
  }

  if (pos >= count) {
    remove.relative = relative || 'at';
  }
  const removeOpts = { ...remove, elements, count, pos };
  let positions =
    lastElementRemovePos(removeOpts) ||
    midElementRemovePos(removeOpts) ||
    firstElementRemovePos(removeOpts);

  if (!positions.startPos) {
    positions.startPos = node.getStart() + 1;
  }

  if (!positions.endPos) {
    positions.endPos = node.getEnd() - 1;
  }
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
