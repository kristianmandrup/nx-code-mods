import { Node, SourceFile } from 'typescript';
import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findMethodDeclaration } from './find';
import { replaceInFile, AnyOpts, modifyTree } from './modify-file';

export interface ClassMethodDecInsertOptions {
  className: string;
  methodId: string;
  codeToInsert: string;
  indexAdj?: number;
}

export interface ClassMethodDecInsertTreeOptions
  extends ClassMethodDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertBeforeMatchingMethod = (opts: AnyOpts) => (node: Node) => {
  const { className, methodId, codeToInsert, indexAdj } = opts;

  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, methodId);
  if (!methodDecl) return;
  const methodDeclIndex = methodDecl.getStart() + (indexAdj || 0);
  return insertCode(node, methodDeclIndex, codeToInsert);
};

export function insertClassMethodDecoratorInFile(
  filePath: string,
  opts: ClassMethodDecInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertBeforeMatchingMethod,
    ...opts,
  });
}

export function insertClassMethodDecoratorInTree(
  tree: Tree,
  opts: ClassMethodDecInsertTreeOptions,
) {
  return modifyTree(tree, opts);
}
