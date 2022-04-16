import { SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
import { findFunctionBlock } from '../find';
import { modifyTree, AnyOpts, replaceInFile, replaceInSource } from '../modify';
import {
  CollectionModifyOpts,
  normalizeRemoveIndexAdj,
  removeFromNode,
} from './positional';

export interface RemoveFunctionOptions {
  id: string;
  remove?: CollectionModifyOpts;
  indexAdj?: number;
}

export interface RemoveFunctionTreeOptions extends RemoveFunctionOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeInFunctionBlock = (opts: AnyOpts) => (srcNode: any) => {
  let { id, remove, indexAdj } = opts;
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  remove = remove || {};
  const funBlock = findFunctionBlock(srcNode, id);
  if (!funBlock) {
    return;
  }
  return removeFromNode(srcNode, {
    elementsField: 'properties',
    node: funBlock,
    ...opts,
  });
};

export function removeInsideFunctionBlockInSource(
  source: string,
  opts: RemoveFunctionOptions,
) {
  const findNodeFn = (node: SourceFile) => findFunctionBlock(node, opts.id);
  const allOpts = {
    findNodeFn,
    modifyFn: removeInFunctionBlock,
    ...opts,
  };
  return replaceInSource(source, allOpts);
}

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

export async function removeInsideFunctionBlockInTree(
  tree: Tree,
  opts: RemoveFunctionTreeOptions,
) {
  return await modifyTree(tree, opts);
}
