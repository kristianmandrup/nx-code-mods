import { insertCode } from '../modify/modify-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findDecorator } from '../find/find';
import { replaceInFile, AnyOpts, modifyTree, replaceInSource } from '../modify';
import { Node, SourceFile } from 'typescript';
import { ensureNewlineClosing } from '../ensure';

export interface ClassDecInsertOptions {
  id: string;
  codeToInsert: string;
  indexAdj?: number;
}

export interface ClassDecInsertTreeOptions extends ClassDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertBeforeClassDecl = (opts: AnyOpts) => (node: Node) => {
  const { id, codeToInsert, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, id);
  if (!classDecl) {
    return;
  }
  // abort if class decorator already present
  const abortIfFound = (node: Node) => findDecorator(node, id);

  if (abortIfFound) {
    const found = abortIfFound(classDecl);
    if (found) {
      return;
    }
  }

  const classDeclIndex = classDecl.getStart() + (indexAdj || 0);
  const code = ensureNewlineClosing(codeToInsert);
  return insertCode(node, classDeclIndex, code);
};

export function insertClassDecoratorInSource(
  source: string,
  opts: ClassDecInsertOptions,
) {
  const findNodeFn = (node: SourceFile) => findClassDeclaration(node, opts.id);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertBeforeClassDecl,
    ...opts,
  });
}

export function insertClassDecoratorInFile(
  filePath: string,
  opts: ClassDecInsertOptions,
) {
  const findNodeFn = (node: SourceFile) => findClassDeclaration(node, opts.id);

  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertBeforeClassDecl,
    ...opts,
  });
}

export async function insertClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
