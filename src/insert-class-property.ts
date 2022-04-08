import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findBlock, findClassDeclaration } from './find';
import { replaceInFile, AnyOpts, modifyTree } from './modify-file';
import { Node } from 'typescript';

export interface ClassPropInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
}

const insertInClassScope = (opts: AnyOpts) => (node: Node) => {
  const { className, codeToInsert, insertPos, indexAdj } = opts;
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const block = findBlock(classDecl);
  if (!block) return;
  let blockIndex = block.getStart() + (indexAdj || 0);
  if (insertPos === 'end') {
    blockIndex = block.getEnd() + (indexAdj || 0);
  }
  return insertCode(node, blockIndex, codeToInsert);
};

export function insertClassPropertyInFile(
  filePath: string,
  opts: ClassPropInsertOptions,
) {
  return replaceInFile(filePath, { modifyFn: insertInClassScope, ...opts });
}

export function insertClassPropertyInTree(
  tree: Tree,
  opts: ClassPropInsertOptions,
) {
  return modifyTree(tree, opts);
}
