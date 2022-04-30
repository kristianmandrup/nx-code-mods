import { findClassMethodDeclaration } from '../find/types';
import { AnyOpts, replaceInFile, modifyTree, replaceInSource } from '../modify';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findFirstMethodDeclaration,
  findLastPropertyDeclaration,
  findMethodDeclaration,
} from '../find';
import { Node, SourceFile } from 'typescript';
import { insertInClassScope } from './positional';
import { endOfIndex, beforeIndex } from '../positional';

export interface ClassMethodInsertOptions {
  classId: string;
  methodId: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
  code: string;
}

export interface ApiClassMethodInsertOptions {
  classId?: string;
  methodId?: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
  code: string;
}
export interface ClassMethodInsertTreeOptions extends ClassMethodInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const functionsMap = {
  defaultIndex: endOfIndex,
  nodeIndex: beforeIndex,
  findMatchingNode: findMethodDeclaration,
  findPivotNode: findFirstMethodDeclaration,
  findAltPivotNode: findLastPropertyDeclaration,
};

const getFirstTypeNode = findFirstMethodDeclaration;

export const insertClassMethod = (opts: AnyOpts) => (srcNode: any) => {
  const { methodId, findNodeFn } = opts;
  const abortIfFound = (node: Node) => findMethodDeclaration(node, methodId);
  const classDecl = findNodeFn(srcNode);
  if (!classDecl) return;
  if (abortIfFound && abortIfFound(classDecl)) {
    return;
  }
  return insertInClassScope(srcNode, {
    ...functionsMap,
    getFirstTypeNode,
    ...opts,
  });
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
  const { classId } = opts;
  const findNodeFn = (node: SourceFile) => findClassDeclaration(node, classId);

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
