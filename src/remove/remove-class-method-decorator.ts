import { findMatchingDecoratorForNode } from './../find/find';
import {
  AnyOpts,
  replaceInFile,
  modifyTree,
  replaceInSource,
  removeCode,
} from '../modify';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassMethodDeclaration } from '../find';
import { SourceFile } from 'typescript';
import { CollectionModifyOpts, removeFromNode } from './positional';

export interface ClassMethodDecoratorRemoveOptions {
  classId: string;
  methodId: string;
  decoratorId: string;
  remove?: CollectionModifyOpts;
}

export interface ApiClassMethodDecoratorRemoveOptions {
  classId?: string;
  methodId?: string;
  decoratorId?: string;
  remove?: CollectionModifyOpts;
}
export interface ClassMethodDecoratorRemoveTreeOptions
  extends ClassMethodDecoratorRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeClassMethodDecorator = (opts: AnyOpts) => (srcNode: any) => {
  const { classId, methodId, decoratorId } = opts;
  const methDecl = findClassMethodDeclaration(srcNode, {
    classId: classId,
    methodId,
  });
  if (!methDecl) return;
  const decorator = findMatchingDecoratorForNode(methDecl, decoratorId);
  if (!decorator) return;
  const startPos = decorator.getStart();
  const endPos = decorator.getEnd();
  return removeCode(srcNode, { startPos, endPos });
};

export function removeClassMethodDecoratorInSource(
  source: string,
  opts: ClassMethodDecoratorRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: removeClassMethodDecorator,
    ...opts,
  });
}
export function removeClassMethodDecoratorInFile(
  filePath: string,
  opts: ClassMethodDecoratorRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeClassMethodDecorator,
    ...opts,
  });
}

export async function removeClassMethodDecoratorsInTree(
  tree: Tree,
  opts: ClassMethodDecoratorRemoveTreeOptions,
) {
  return await modifyTree(tree, opts);
}
