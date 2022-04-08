import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findClassDeclaration } from './find';
import { modifyFile, AnyOpts, modifyTree } from './modify-file';
import { Node } from 'typescript';

export interface ClassDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
  indexAdj?: number;
}

export const insertBeforeClassDecl = (opts: AnyOpts) => (node: Node) => {
  const { className, codeToInsert, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const classDeclIndex = classDecl.getStart() + (indexAdj || 0);
  return insertCode(node, classDeclIndex, codeToInsert);
};

export function insertClassDecoratorInFile(
  filePath: string,
  opts: ClassDecInsertOptions,
) {
  modifyFile(filePath, 'ClassDeclaration', insertBeforeClassDecl, opts);
}

export function insertClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecInsertOptions,
) {
  modifyTree(tree, 'ClassDeclaration', insertBeforeClassDecl, opts);
}
