import { SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
import { findFunctionBlock } from '../find';
import { modifyTree, AnyOpts, replaceInFile, replaceInSource } from '../modify';
import {
  CollectionModifyOpts,
  normalizeRemoveIndexAdj,
  removeFromNode,
} from './positional';
import { ensureStmtClosing } from '../ensure';

export interface RemoveFunctionOptions {
  functionId: string;
  remove?: CollectionModifyOpts;
  indexAdj?: number;
}
export interface ApiRemoveFunctionOptions {
  functionId?: string;
  remove?: CollectionModifyOpts;
  indexAdj?: number;
}

export interface RemoveFunctionTreeOptions extends RemoveFunctionOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeInFunctionBlock = (opts: AnyOpts) => (srcNode: any) => {
  let { functionId, remove, indexAdj } = opts;
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  remove = remove || {};
  const funBlock = findFunctionBlock(srcNode, functionId);
  if (!funBlock) {
    return;
  }
  return removeFromNode(srcNode, {
    formatCode: ensureStmtClosing,
    elementsField: 'statements',
    node: funBlock,
    ...opts,
  });
};

export function removeInsideFunctionBlockInSource(
  source: string,
  opts: RemoveFunctionOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findFunctionBlock(node, opts.functionId);
  const allOpts = {
    findNodeFn,
    formatCode: ensureStmtClosing,
    modifyFn: removeInFunctionBlock,
    ...opts,
  };
  return replaceInSource(source, allOpts);
}

export function removeInsideFunctionBlockInFile(
  filePath: string,
  opts: RemoveFunctionOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findFunctionBlock(node, opts.functionId);
  const allOpts = {
    findNodeFn,
    formatCode: ensureStmtClosing,
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
