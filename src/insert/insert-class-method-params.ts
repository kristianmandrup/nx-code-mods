import { findParameter } from '../find/types';
import { CollectionInsert, insertIntoNode } from './positional';
import {
  findFirstParameter,
  findLastParameter,
  findClassDeclaration,
  findClassMethodDeclaration,
  findFirstParamPos,
  findLastParamPos,
  findParameterBounds,
  findMatchingDecoratorForNode,
} from '../find';
import { replaceInFile, AnyOpts, modifyTree, replaceInSource } from '../modify';
import { Node, SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';

export interface ClassMethodParamsInsertOptions {
  classId: string;
  methodId: string;
  paramId: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}

export interface ApiClassMethodParamsInsertOptions {
  classId?: string;
  methodId?: string;
  paramId?: string;
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
    const { classId, methodId, paramId, insert, code } = opts;
    const node = findClassMethodDeclaration(srcNode, {
      classId: classId,
      methodId,
    });
    if (!node) return;
    const abortIfFound = (node: Node) => findParameter(node, paramId);
    if (abortIfFound) {
      const found = abortIfFound(node);
      if (found) {
        return;
      }
    }
    return insertIntoNode(srcNode, {
      bounds: findParameterBounds(node),
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
