import { Node, SourceFile } from 'typescript';
import { insertCode } from '../modify/modify-code';
import { Tree } from '@nrwl/devkit';
import { getFirstStatement, findLastImport, hasAnyImportDecl } from '../find';
import { modifyTree, AnyOpts, replaceInFile, replaceInSource } from '../modify';

export interface AppendAfterImportsOptions {
  code: string;
  indexAdj?: number;
}

export interface ApiAppendAfterImportsOptions {
  code: string;
  indexAdj?: number;
}

export interface AppendAfterImportsTreeOptions
  extends AppendAfterImportsOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const getPosAfterLastImport = (node: SourceFile) => {
  const lastImportDecl = findLastImport(node);
  return !lastImportDecl ? node.getStart() : lastImportDecl.getEnd();
};

export const insertAfterLastImport = (opts: AnyOpts) => (node: any) => {
  const { code } = opts;
  const importIndex = getPosAfterLastImport(node);
  return insertCode(node, importIndex, code);
};

export function appendAfterImportsInSource(
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
  return replaceInSource(filePath, allOpts);
}
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
