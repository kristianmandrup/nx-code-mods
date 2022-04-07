import { AnyOpts, modifyFile } from './modify-file';
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
  indexAdj?: number;
}

const insertBeforeFirstMethod = (opts: AnyOpts) => (node: Node) => {
  const { className, codeToInsert, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findFirstMethodDeclaration(classDecl);
  if (!methodDecl) return;
  const methodDeclIndex = methodDecl.getStart() + (indexAdj || 0);
  return insertCode(node, methodDeclIndex, codeToInsert);
};

export function insertClassMethod(tree: Tree, opts: ClassMethodInsertOptions) {
  modifyFile(tree, 'ClassDeclaration', insertBeforeFirstMethod, opts);
}
