import { insertCode } from '../modify/modify-code';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findMatchingDecoratorForNode,
} from '../find/find';
import { replaceInFile, AnyOpts, modifyTree, replaceInSource } from '../modify';
import { Node, SourceFile } from 'typescript';
import { ensureNewlineClosing } from '../ensure';
import { beforeIndex, startOfIndex } from '../positional';

export interface ClassDecoratorInsertOptions {
  classId: string;
  indexAdj?: number;
  code: string;
}

export interface ApiClassDecoratorInsertOptions {
  classId?: string;
  indexAdj?: number;
  code: string;
}

export interface ClassDecoratorInsertTreeOptions
  extends ClassDecoratorInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertBeforeClassDecl = (opts: AnyOpts) => (node: Node) => {
  let { classId, decoratorId, code, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) {
    return;
  }
  // abort if class decorator already present
  const abortIfFound = (node: Node) =>
    findMatchingDecoratorForNode(node, decoratorId);

  if (abortIfFound) {
    const found = abortIfFound(classDecl);
    if (found) {
      return;
    }
  }
  const classDeclIndex = beforeIndex(classDecl) + (indexAdj || 0);
  code = ensureNewlineClosing(code);
  return insertCode(node, classDeclIndex, code);
};

export function insertClassDecoratorInSource(
  source: string,
  opts: ClassDecoratorInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);

  // TODO: add abortIfFound
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertBeforeClassDecl,
    ...opts,
  });
}

export function insertClassDecoratorInFile(
  filePath: string,
  opts: ClassDecoratorInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);

  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertBeforeClassDecl,
    ...opts,
  });
}

export async function insertClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecoratorInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
