import { CollectionInsert, insertIntoNode } from './positional';
import { findClassDeclaration, findClassMethodDeclaration } from '../find';
import { replaceInFile, AnyOpts, modifyTree, replaceInSource } from '../modify';
import { SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
export interface ClassMethodParamsInsertOptions {
  classId: string;
  methodId: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}

export interface ApiClassMethodParamsInsertOptions {
  classId?: string;
  methodId?: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}

export interface ClassMethodParamsInsertTreeOptions
  extends ClassMethodParamsInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertParametersInClassMethod =
  (opts: AnyOpts) => (srcNode: any) => {
    const { classId, methodId, insert, code } = opts;
    const node = findClassMethodDeclaration(srcNode, {
      classId: classId,
      methodId,
    });
    if (!node) return;
    return insertIntoNode(srcNode, {
      elementsField: 'parameters',
      node,
      code,
      insert,
      ...opts,
    });
  };

export function insertClassMethodParameterInSource(
  filePath: string,
  opts: ClassMethodParamsInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(filePath, {
    findNodeFn,
    modifyFn: insertParametersInClassMethod,
    ...opts,
  });
}

export function insertClassMethodParameterInFile(
  filePath: string,
  opts: ClassMethodParamsInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertParametersInClassMethod,
    ...opts,
  });
}

export async function insertClassMethodParameterInTree(
  tree: Tree,
  opts: ClassMethodParamsInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
