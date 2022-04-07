import { Node } from 'typescript';
import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findMethodDeclaration } from './find';
import { modifyFile, AnyOpts } from './modify-file';

export interface ClassMethodDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  methodId: string;
  codeToInsert: string;
}

export const insertBeforeMatchingMethod = (opts: AnyOpts) => (node: Node) => {
  const { className, methodId, codeToInsert } = opts;

  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, methodId);
  if (!methodDecl) return;
  const methodDeclIndex = methodDecl.getStart();
  return insertCode(node, methodDeclIndex, codeToInsert);
};

export function insertClassMethodDecorator(
  tree: Tree,
  opts: ClassMethodDecInsertOptions,
) {
  modifyFile(tree, 'ClassDeclaration', insertBeforeMatchingMethod, opts);
}
