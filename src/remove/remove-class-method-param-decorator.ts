import { findClassMethodParameterDeclaration } from './../find/find';
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

export interface ClassMethodParamDecoratorRemoveOptions {
  classId: string;
  methodId: string;
  paramId: string;
  remove?: CollectionModifyOpts;
}

export interface ApiClassMethodParamDecoratorRemoveOptions {
  classId?: string;
  methodId?: string;
  paramId?: string;
  remove?: CollectionModifyOpts;
}
export interface ClassMethodParamDecoratorRemoveTreeOptions
  extends ClassMethodParamDecoratorRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeMethodParamDecorators =
  (opts: AnyOpts) => (srcNode: any) => {
    const { classId, methodId, paramId } = opts;
    const node = findClassMethodParameterDeclaration(srcNode, {
      classId: classId,
      methodId,
      paramId,
    });
    if (!node) return;
    return removeFromNode(srcNode, {
      elementsField: 'decorators',
      node,
      ...opts,
    });
  };

export function removeClassMethodParamDecoratorsInSource(
  source: string,
  opts: ClassMethodParamDecoratorRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: removeMethodParamDecorators,
    ...opts,
  });
}

export function removeClassMethodParamDecoratorsInFile(
  filePath: string,
  opts: ClassMethodParamDecoratorRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeMethodParamDecorators,
    ...opts,
  });
}

export async function removeClassMethodParamDecoratorsInTree(
  tree: Tree,
  opts: ClassMethodParamDecoratorRemoveTreeOptions,
) {
  return await modifyTree(tree, opts);
}
