import { SourceFile } from 'typescript';
import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { getFirstStatement, findLastImport } from './find';
import { modifyTree, AnyOpts, replaceInFile } from './modify-file';

export interface InsertOptions {
  codeToInsert: string;
  indexAdj?: number;
}

export interface InsertTreeOptions extends InsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertAfterLastImport = (opts: AnyOpts) => (node: any) => {
  const { codeToInsert, indexAdj } = opts;
  const lastImportStmt = findLastImport(node);
  let importIndex = 0;
  if (!lastImportStmt) {
    importIndex = node.getStart() + (indexAdj || 0);
  } else {
    importIndex = lastImportStmt.getEnd() + (indexAdj || 0);
  }
  return insertCode(node, importIndex, codeToInsert);
};

export function appendAfterImportsInFile(
  filePath: string,
  opts: { codeToInsert: string; indexAdj?: number },
) {
  const allOpts = {
    checkFn: hasAnyImportDecl,
    findNodeFn: findLastImport,
    modifyFn: insertAfterLastImport,
    getDefaultNodeFn: getFirstStatement,
    ...opts,
  };
  return replaceInFile(filePath, allOpts);
}

const hasAnyImportDecl = (node: SourceFile) => Boolean(findLastImport(node));

export function appendAfterImportsInTree(tree: Tree, opts: InsertTreeOptions) {
  return modifyTree(tree, opts);
}
