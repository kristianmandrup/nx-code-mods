import { insertCode } from './modify-code';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findMethodDeclaration,
  findDecorator,
  findParamWithDecorator,
} from './find';
import { replaceInFile, AnyOpts, modifyTree } from './modify-file';
import { Node, SourceFile } from 'typescript';

export interface ClassMethodDecParamInsertOptions {
  className: string;
  methodId: string;
  id: string;
  codeToInsert: string;
  indexAdj?: number;
}

export interface ClassMethodDecParamInsertTreeOptions
  extends ClassMethodDecParamInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertParamInMatchingMethod = (opts: AnyOpts) => (node: Node) => {
  const { className, methodId, id, codeToInsert, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, methodId);
  if (!methodDecl) return;

  // abort if class decorator already present
  const abortIfFound = (node: Node) => findParamWithDecorator(node, id);

  if (abortIfFound) {
    const found = abortIfFound(methodDecl);
    if (found) {
      return;
    }
  }
  // TODO: support full insert positional options
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
