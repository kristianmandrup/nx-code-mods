import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findMethodDeclaration } from './find';
import { replaceInFile, AnyOpts, modifyTree } from './modify-file';
import { Node, SourceFile } from 'typescript';

export interface ClassMethodDecParamInsertOptions {
  className: string;
  methodId: string;
  codeToInsert: string;
  indexAdj?: number;
}

export interface ClassMethodDecParamInsertTreeOptions
  extends ClassMethodDecParamInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
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

export function insertClassMethodParamDecoratorInFile(
  filePath: string,
  opts: ClassMethodDecParamInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertParamInMatchingMethod,
    ...opts,
  });
}

export function insertClassMethodParamDecoratorInTree(
  tree: Tree,
  opts: ClassMethodDecParamInsertTreeOptions,
) {
  return modifyTree(tree, opts);
}
