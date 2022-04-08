import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findFirstMethodDeclaration } from './find';
import { Node } from 'typescript';

export interface ClassMethodInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
}

const insertInMethodBlock = (opts: AnyOpts) => (node: Node) => {
  const { className, codeToInsert, insertPos, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  let insertIndex;
  if (insertPos === 'end') {
    insertIndex = classDecl.getEnd() + (indexAdj || 0);
  } else {
    const methodDecl = findFirstMethodDeclaration(classDecl);
    if (!methodDecl) return;
    insertIndex = methodDecl.getStart() + (indexAdj || 0);
  }
  return insertCode(node, insertIndex, codeToInsert);
};

export function insertClassMethodInFile(
  filePath: string,
  opts: ClassMethodInsertOptions,
) {
  replaceInFile(filePath, { modifyFn: insertInMethodBlock, ...opts });
}

export function insertClassMethodInTree(
  tree: Tree,
  opts: ClassMethodInsertOptions,
) {
  modifyTree(tree, opts);
}
