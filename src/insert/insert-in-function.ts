import { ensureStmtClosing } from './../ensure';
import { SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
import { findFunctionBlock } from '../find';
import { modifyTree, AnyOpts, replaceInFile, replaceInSource } from '../modify';
import { CollectionInsert, insertIntoNode } from './positional';

export interface InsertFunctionOptions {
  code: string;
  id: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertFunctionTreeOptions extends InsertFunctionOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertInFunctionBlock = (opts: AnyOpts) => (srcNode: any) => {
  let { code, id, insert } = opts;
  insert = insert || {};
  const funBlock = findFunctionBlock(srcNode, id);
  if (!funBlock) {
    return;
  }
  return insertIntoNode(srcNode, {
    formatCode: ensureStmtClosing,
    elementsField: 'elements',
    node: funBlock,
    code,
    insert,
  });
};

export function insertInsideFunctionBlockInSource(
  source: string,
  opts: InsertFunctionOptions,
) {
  const findNodeFn = (node: SourceFile) => findFunctionBlock(node, opts.id);
  const allOpts = {
    findNodeFn,
    modifyFn: insertInFunctionBlock,
    ...opts,
  };
  return replaceInSource(source, allOpts);
}

export function insertInsideFunctionBlockInFile(
  filePath: string,
  opts: InsertFunctionOptions,
) {
  const findNodeFn = (node: SourceFile) => findFunctionBlock(node, opts.id);
  const allOpts = {
    findNodeFn,
    modifyFn: insertInFunctionBlock,
    ...opts,
  };
  return replaceInFile(filePath, allOpts);
}

export async function insertInsideFunctionBlockInTree(
  tree: Tree,
  opts: InsertFunctionTreeOptions,
) {
  return await modifyTree(tree, opts);
}
