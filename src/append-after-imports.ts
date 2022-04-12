import { SourceFile } from 'typescript';
import { insertCode } from './modify-code';
import { Tree } from '@nrwl/devkit';
import { getFirstStatement, findLastImport, hasAnyImportDecl } from './find';
import { modifyTree, AnyOpts, replaceInFile } from './modify-file';

export interface AppendAfterImportsOptions {
  codeToInsert: string;
  indexAdj?: number;
}

export interface AppendAfterImportsTreeOptions
  extends AppendAfterImportsOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertAfterLastImport = (opts: AnyOpts) => (node: any) => {
  const { codeToInsert, indexAdj } = opts;
  const lastImportDecl = findLastImport(node);
  let importIndex = 0;
  if (!lastImportDecl) {
    importIndex = node.getStart() + (indexAdj || 0);
  } else {
    importIndex = lastImportDecl.getEnd() + (indexAdj || 0);
  }
  return insertCode(node, importIndex, codeToInsert);
};

export function appendAfterImportsInFile(
  filePath: string,
  opts: AppendAfterImportsOptions,
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

export function appendAfterImportsInTree(
  tree: Tree,
  opts: AppendAfterImportsTreeOptions,
) {
  return modifyTree(tree, opts);
}
