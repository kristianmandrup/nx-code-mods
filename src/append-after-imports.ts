import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { findLastImport } from './find';
import { modifyTree, AnyOpts, modifyFile } from './modify-file';

export interface InsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  codeToInsert: string;
}

export const insertAfterLastImport = (opts: AnyOpts) => (node: any) => {
  const { codeToInsert } = opts;
  const lastImportStmt = findLastImport(node);
  if (!lastImportStmt) return;
  const lastImportIndex = lastImportStmt.getEnd();
  return insertCode(node, lastImportIndex, codeToInsert);
};

export function appendAfterImportsInFile(
  filePath: string,
  opts: InsertOptions,
) {
  modifyFile(filePath, 'ImportDeclaration', insertAfterLastImport, opts);
}

export function appendAfterImportsInTree(tree: Tree, opts: InsertOptions) {
  modifyTree(tree, 'ImportDeclaration', insertAfterLastImport, opts);
}
