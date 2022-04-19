import { beforeIndex, startOfIndex } from './../positional';
import {
  findClassMethodDecorator,
  findClassMethodDeclaration,
} from './../find';
import { Node, SourceFile } from 'typescript';
import { insertCode } from '../modify/modify-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findDecorator } from '../find';
import { replaceInFile, AnyOpts, modifyTree, replaceInSource } from '../modify';
import { ensureNewlineClosing } from '../ensure';

export interface ClassMethodDecoratorInsertOptions {
  classId: string;
  methodId: string;
  decoratorId: string; // decorator id
  code: string;
  indexAdj?: number;
}

export interface ApiClassMethodDecoratorInsertOptions {
  classId?: string;
  methodId?: string;
  decoratorId?: string; // decorator id
  indexAdj?: number;
  code: string;
}

export interface ClassMethodDecoratorInsertTreeOptions
  extends ClassMethodDecoratorInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertClassMethodDecorator = (opts: AnyOpts) => (node: Node) => {
  let { classId, methodId, decoratorId, code, indexAdj } = opts;
  const methodDecl = findClassMethodDeclaration(node, {
    classId,
    methodId,
  });
  if (!methodDecl) return;
  // abort if class decorator already present
  const abortIfFound = (node: Node) => findDecorator(node, decoratorId);

  if (abortIfFound) {
    const found = abortIfFound(methodDecl);
    if (found) {
      return;
    }
  }

  const methodDeclIndex = beforeIndex(methodDecl) + (indexAdj || 0);
  code = ensureNewlineClosing(code);
  return insertCode(node, methodDeclIndex, code);
};

export function insertClassMethodDecoratorInSource(
  source: string,
  opts: ClassMethodDecoratorInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertClassMethodDecorator,
    ...opts,
  });
}

export function insertClassMethodDecoratorInFile(
  filePath: string,
  opts: ClassMethodDecoratorInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertClassMethodDecorator,
    ...opts,
  });
}

export async function insertClassMethodDecoratororatorInTree(
  tree: Tree,
  opts: ClassMethodDecoratorInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
