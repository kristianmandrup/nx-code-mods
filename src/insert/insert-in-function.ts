import { ensureStmtClosing } from './../ensure';
import { SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
import { findFunctionBlock } from '../find';
import { insertCode, modifyTree, AnyOpts, replaceInFile } from '../modify';
import {
  afterLastElementPos,
  aroundElementPos,
  CollectionInsert,
  getInsertPosNum,
  insertIntoNode,
} from './positional';

export interface InsertFunctionOptions {
  codeToInsert: string;
  id: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertFunctionTreeOptions extends InsertFunctionOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertInFunctionBlock = (opts: AnyOpts) => (srcNode: any) => {
  let { codeToInsert, id, insert } = opts;
  insert = insert || {};
  const funBlock = findFunctionBlock(srcNode, id);
  if (!funBlock) {
    return;
  }
  return insertIntoNode(srcNode, {
    formatCode: ensureStmtClosing,
    elementsField: 'elements',
    node: funBlock,
    codeToInsert,
    insert,
  });
};

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
