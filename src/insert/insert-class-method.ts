import { ensureStmtClosing } from '../ensure';
import {
  insertCode,
  AnyOpts,
  replaceInFile,
  modifyTree,
  replaceInSource,
} from '../modify';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findFirstMethodDeclaration,
  findLastPropertyDeclaration,
  findMethodDeclaration,
} from '../find';
import { Node, SourceFile } from 'typescript';
import { insertInClassScope, endOfIndex } from './positional';

export interface ClassMethodInsertOptions {
  classId: string;
  methodId: string;
  codeToInsert: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
}

export interface ClassMethodInsertTreeOptions extends ClassMethodInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const functionsMap = {
  defaultIndex: endOfIndex,
  findMatchingNode: findMethodDeclaration,
  findPivotNode: findFirstMethodDeclaration,
  findAltPivotNode: findLastPropertyDeclaration,
};

export const insertClassMethod = (opts: AnyOpts) => (srcNode: SourceFile) => {
  return insertInClassScope(srcNode, { ...functionsMap, ...opts });
};

export function insertClassMethodInSource(
  source: string,
  opts: ClassMethodInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertClassMethod,
    ...opts,
  });
}

export function insertClassMethodInFile(
  filePath: string,
  opts: ClassMethodInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertClassMethod,
    ...opts,
  });
}

export async function insertClassMethodInTree(
  tree: Tree,
  opts: ClassMethodInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
