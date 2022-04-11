import { FunctionDeclaration, SourceFile } from 'typescript';
import { insertCode, InsertPosition } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { getFirstStatement, findFunctionBlock, findFunction } from './find';
import { modifyTree, AnyOpts, replaceInFile } from './modify-file';
import { CollectionInsert, ensureStmtClosing } from './positional';

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

export const insertInFunctionBlock = (opts: AnyOpts) => (node: any) => {
  const { codeToInsert, id, insert, indexAdj } = opts;
  const funBlock = findFunctionBlock(node, id);
  if (!funBlock) {
    return;
  }
  let insertIndex = 0;
  const { index } = insert || {};
  insertIndex =
    index === 'end' ? funBlock.getEnd() - 1 : funBlock.getStart() + 1;
  insertIndex += indexAdj || 0;
  const code = ensureStmtClosing(codeToInsert);
  return insertCode(node, insertIndex, code);
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

export function insertInsideFunctionBlockInTree(
  tree: Tree,
  opts: InsertFunctionTreeOptions,
) {
  return modifyTree(tree, opts);
}
