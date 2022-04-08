import { Node } from 'typescript';
import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findMethodDeclaration } from './find';
import { modifyFile, AnyOpts, modifyTree } from './modify-file';

export interface ClassMethodDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  methodId: string;
  codeToInsert: string;
  indexAdj?: number;
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
  modifyFile(filePath, 'ClassDeclaration', insertBeforeMatchingMethod, opts);
}

export function insertClassMethodDecoratorInTree(
  tree: Tree,
  opts: ClassMethodDecInsertOptions,
) {
  modifyTree(tree, 'ClassDeclaration', insertBeforeMatchingMethod, opts);
}
