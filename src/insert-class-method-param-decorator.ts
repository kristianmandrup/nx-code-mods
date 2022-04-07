import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findMethodDeclaration } from './find';
import { modifyFile, AnyOpts } from './modify-file';
import { Node } from 'typescript';

export interface ClassMethodDecArgInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  methodId: string;
  codeToInsert: string;
  indexAdj?: number;
}

export const insertParamInMatchingMethod = (opts: AnyOpts) => (node: Node) => {
  const { className, methodId, codeToInsert, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, methodId);
  if (!methodDecl) return;
  const parametersIndex = methodDecl.parameters.pos + (indexAdj || 0);
  return insertCode(node, parametersIndex, codeToInsert);
};

export function insertClassMethodParamDecorator(
  tree: Tree,
  opts: ClassMethodDecArgInsertOptions,
) {
  modifyFile(tree, 'ClassDeclaration', insertParamInMatchingMethod, opts);
}
