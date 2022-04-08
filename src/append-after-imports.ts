import { SourceFile } from 'typescript';
import { insertCode } from './insert-code';
import { Tree } from '@nrwl/devkit';
import { getFirstStatement, findLastImport } from './find';
import { modifyTree, AnyOpts, replaceInFile } from './modify-file';

export interface InsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  codeToInsert: string;
  indexAdj?: number;
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
    getDefaultNodeFn: getFirstStatement,
    ...opts,
  };
  return replaceInFile(
    filePath,
    'ImportDeclaration',
    insertAfterLastImport,
    allOpts,
  );
}

const hasAnyImportDecl = (node: SourceFile) => Boolean(findLastImport(node));

export function appendAfterImportsInTree(tree: Tree, opts: InsertOptions) {
  return modifyTree(tree, 'ImportDeclaration', insertAfterLastImport, opts);
}
