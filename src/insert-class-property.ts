import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findBlock, findClassDeclaration } from './find';
import { modifyFile, AnyOpts } from './modify-file';
import { Node } from 'typescript';

export interface ClassPropInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
  indexAdj?: number;
}

const insertAtTopOfClassScope = (opts: AnyOpts) => (node: Node) => {
  const { className, codeToInsert, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const block = findBlock(classDecl);
  if (!block) return;
  const blockIndex = block.getStart() + (indexAdj || 0);
  return insertCode(node, blockIndex, codeToInsert);
};

export function insertClassProperty(tree: Tree, opts: ClassPropInsertOptions) {
  modifyFile(tree, 'ClassDeclaration', insertAtTopOfClassScope, opts);
}
