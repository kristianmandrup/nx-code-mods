import { AnyOpts, modifyFile, modifyTree } from './modify-file';
import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
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
  modifyFile(filePath, 'ClassDeclaration', insertInMethodBlock, opts);
}

export function insertClassMethodInTree(
  tree: Tree,
  opts: ClassMethodInsertOptions,
) {
  modifyTree(tree, 'ClassDeclaration', insertInMethodBlock, opts);
}
