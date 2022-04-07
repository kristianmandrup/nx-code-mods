import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findClassDeclaration } from './find';
import { modifyFile, AnyOpts } from './modify-file';
import { Node } from 'typescript';

export interface ClassDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
}

export const insertBeforeClassDecl = (opts: AnyOpts) => (node: Node) => {
  const { className, codeToInsert } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const classDeclIndex = classDecl.getStart();
  return insertCode(node, classDeclIndex, codeToInsert);
};

export function insertClassDecorator(tree: Tree, opts: ClassDecInsertOptions) {
  modifyFile(tree, 'ClassDeclaration', insertBeforeClassDecl, opts);
}
