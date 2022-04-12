import { FunctionDeclaration, SourceFile } from 'typescript';
import { insertCode, InsertPosition } from './modify-code';
import { Tree } from '@nrwl/devkit';
import { getFirstStatement, findFunctionBlock, findFunction } from './find';
import { modifyTree, AnyOpts, replaceInFile } from './modify-file';
import {
  afterLastElementPos,
  aroundElementPos,
  CollectionInsert,
  ensureStmtClosing,
  getInsertPosNum,
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

export const insertInFunctionBlock = (opts: AnyOpts) => (node: any) => {
  let { codeToInsert, id, insert, indexAdj } = opts;
  insert = insert || {};
  const funBlock = findFunctionBlock(node, id);
  if (!funBlock) {
    return;
  }
  const elements = funBlock.statements;
  const count = elements.length;

  let insertPosNum =
    getInsertPosNum({
      type: 'array',
      node: funBlock,
      elements,
      insert,
      count,
    }) || 0;
  if (count === 0) {
    const code = ensureStmtClosing(codeToInsert);
    const insertPosition = funBlock.getStart() + 1;
    return insertCode(node, insertPosition, code);
  }
  if (insertPosNum === -1) {
    insertPosNum = 0;
    insert.relative = 'before';
  }

  let insertPosition =
    insertPosNum >= count
      ? afterLastElementPos(elements)
      : aroundElementPos(elements, insertPosNum, insert.relative);

  insertPosition += indexAdj || 0;
  const code = ensureStmtClosing(codeToInsert);
  return insertCode(node, insertPosition, code);
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
