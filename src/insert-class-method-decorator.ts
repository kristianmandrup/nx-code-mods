import { Node, SourceFile } from 'typescript';
import { insertCode } from './modify-code';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findMethodDeclaration,
  findDecorator,
} from './find';
import { replaceInFile, AnyOpts, modifyTree } from './modify-file';
import { ensureNewlineClosing } from './positional';

export interface ClassMethodDecInsertOptions {
  className: string;
  methodId: string;
  id: string; // decorator id
  codeToInsert: string;
  indexAdj?: number;
}

export interface ClassMethodDecInsertTreeOptions
  extends ClassMethodDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertBeforeMatchingMethod = (opts: AnyOpts) => (node: Node) => {
  const { className, methodId, id, codeToInsert, indexAdj } = opts;

  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, methodId);
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
  const code = ensureNewlineClosing(codeToInsert);
  return insertCode(node, methodDeclIndex, code);
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
