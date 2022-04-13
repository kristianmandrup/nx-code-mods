import { SourceFile } from 'typescript';
import { removeCode } from './modify-code';
import { Tree } from '@nrwl/devkit';
import { findFunctionBlock } from './find';
import { modifyTree, AnyOpts, replaceInFile } from './modify-file';
import {
  afterLastElementRemovePos,
  CollectionRemove,
  getElementRemovePositions,
  getRemovePosNum,
} from './positional';

export interface RemoveFunctionOptions {
  id: string;
  remove?: CollectionRemove;
  indexAdj?: number;
}

export interface RemoveFunctionTreeOptions extends RemoveFunctionOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeInFunctionBlock = (opts: AnyOpts) => (node: any) => {
  let { id, remove, indexAdj } = opts;
  remove = remove || {};
  const funBlock = findFunctionBlock(node, id);
  if (!funBlock) {
    return;
  }
  const elements = funBlock.statements;
  const count = elements.length;

  let removePosNum =
    getRemovePosNum({
      type: 'array',
      node: funBlock,
      elements,
      remove,
      count,
    }) || 0;
  if (count === 0) {
    const positions = {
      startPos: funBlock.getStart() + 1,
      endPos: funBlock.getEnd() - 1,
    };
    return removeCode(node, positions);
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
    positions.startPos = funBlock.getStart();
  }

  if (!positions.endPos) {
    positions.endPos = funBlock.getEnd();
  }
  positions.startPos += indexAdj.start || 0;
  positions.endPos += indexAdj.end || 0;
  return removeCode(node, positions);
};

export function removeInsideFunctionBlockInFile(
  filePath: string,
  opts: RemoveFunctionOptions,
) {
  const findNodeFn = (node: SourceFile) => findFunctionBlock(node, opts.id);
  const allOpts = {
    findNodeFn,
    modifyFn: removeInFunctionBlock,
    ...opts,
  };
  return replaceInFile(filePath, allOpts);
}

export function removeInsideFunctionBlockInTree(
  tree: Tree,
  opts: RemoveFunctionTreeOptions,
) {
  return modifyTree(tree, opts);
}
