import {
  removeCode,
  AnyOpts,
  replaceInFile,
  modifyTree,
  replaceInSource,
} from '../modify';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassMethodDeclaration } from '../find';
import { SourceFile } from 'typescript';
import { CollectionModifyOpts, removeFromNode } from './positional';

export interface ClassMethodParamRemoveOptions {
  classId: string;
  methodId: string;
  remove?: CollectionModifyOpts;
}

export interface ApiClassMethodParamRemoveOptions {
  classId?: string;
  methodId?: string;
  remove?: CollectionModifyOpts;
}
export interface ClassMethodParamRemoveTreeOptions
  extends ClassMethodParamRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeClassMethodParameters =
  (opts: AnyOpts) => (srcNode: any) => {
    const { classId, methodId } = opts;
    const node = findClassMethodDeclaration(srcNode, {
      classId: classId,
      methodId,
    });
    if (!node) return;
    return removeFromNode(srcNode, {
      elementsField: 'parameters',
      node,
      ...opts,
    });
  };

export function removeClassMethodParamsInSource(
  source: string,
  opts: ClassMethodParamRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: removeClassMethodParameters,
    ...opts,
  });
}
export function removeClassMethodParamsInFile(
  filePath: string,
  opts: ClassMethodParamRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeClassMethodParameters,
    ...opts,
  });
}

export async function removeClassMethodParamsInTree(
  tree: Tree,
  opts: ClassMethodParamRemoveTreeOptions,
) {
  return await modifyTree(tree, opts);
}
