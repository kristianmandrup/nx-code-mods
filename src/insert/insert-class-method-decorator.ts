import { findClassMethodDeclaration } from './../find';
import { Node, SourceFile } from 'typescript';
import { insertCode } from '../modify/modify-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findDecorator } from '../find';
import { replaceInFile, AnyOpts, modifyTree, replaceInSource } from '../modify';
import { ensureNewlineClosing } from '../ensure';

export interface ClassMethodDecInsertOptions {
  classId: string;
  methodId: string;
  id: string; // decorator id
  code: string;
  indexAdj?: number;
}

export interface ClassMethodDecInsertTreeOptions
  extends ClassMethodDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertBeforeMatchingMethod = (opts: AnyOpts) => (node: Node) => {
  const { classId, methodId, id, code, indexAdj } = opts;
  const methodDecl = findClassMethodDeclaration(node, { classId, methodId });
  if (!methodDecl) return;
  // abort if class decorator already present
  const abortIfFound = (node: Node) => findDecorator(node, id);

  if (abortIfFound) {
    const found = abortIfFound(methodDecl);
    if (found) {
      return;
    }
  }

  const methodDeclIndex = methodDecl.getStart() + (indexAdj || 0);
  const code = ensureNewlineClosing(code);
  return insertCode(node, methodDeclIndex, code);
};

export function insertClassMethodDecoratorInSource(
  source: string,
  opts: ClassMethodDecInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertBeforeMatchingMethod,
    ...opts,
  });
}

export function insertClassMethodDecoratorInFile(
  filePath: string,
  opts: ClassMethodDecInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertBeforeMatchingMethod,
    ...opts,
  });
}

export async function insertClassMethodDecoratorInTree(
  tree: Tree,
  opts: ClassMethodDecInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
