import { CollectionInsert, insertIntoNode } from './positional';
import { findClassDeclaration, findClassMethodDeclaration } from '../find';
import { replaceInFile, AnyOpts, modifyTree } from '../modify';
import { SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
export interface ClassMethodParamsInsertOptions {
  classId: string;
  methodId: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface ClassMethodParamsInsertTreeOptions
  extends ClassMethodParamsInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertParametersInClassMethod =
  (opts: AnyOpts) => (srcNode: SourceFile) => {
    const { classId, methodId, insert, codeToInsert } = opts;
    const node = findClassMethodDeclaration(srcNode, {
      classId: classId,
      methodId,
    });
    if (!node) return;
    return insertIntoNode(srcNode, {
      elementsField: 'parameters',
      node,
      codeToInsert,
      insert,
      ...opts,
    });
  };

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
