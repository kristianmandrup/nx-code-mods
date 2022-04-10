import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration } from './find';
import { replaceInFile, AnyOpts, modifyTree } from './modify-file';
import { Node, SourceFile } from 'typescript';
import { ensureNewlineClosing } from './positional';

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
  const classDeclIndex = classDecl.getStart() + (indexAdj || 0);
  const code = ensureNewlineClosing(codeToInsert);
  return insertCode(node, classDeclIndex, code);
};

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

export function insertClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecInsertTreeOptions,
) {
  return modifyTree(tree, opts);
}
