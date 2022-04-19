import { SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
import {
  findMatchingImportDecl,
  findMatchingImportDeclarationsByFileRef,
  hasAnyImportDecl,
} from '../find';
import {
  removeCode,
  modifyTree,
  AnyOpts,
  replaceInFile,
  replaceInSource,
} from '../modify';

export interface RemoveImportOptions {
  importId: string;
  importFileRef: string;
}

export interface ApiRemoveImportOptions {
  importId?: string;
  importFileRef?: string;
}
export interface RemoveImportTreeOptions extends RemoveImportOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeImport = (opts: AnyOpts) => (node: any) => {
  let { importId, importFileRef } = opts;
  const importDecl = findMatchingImportDecl(node, { importId, importFileRef });
  if (!importDecl) {
    return;
  }
  const startPos = importDecl.getStart();
  const endPos = importDecl.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeImportInSource(
  sourceCode: string,
  opts: RemoveImportOptions,
) {
  const findNodeFn = (node: SourceFile) => {
    return findMatchingImportDeclarationsByFileRef(node, opts.importFileRef);
  };
  const allOpts = {
    checkFn: hasAnyImportDecl,
    findNodeFn,
    modifyFn: removeImport,
    ...opts,
  };
  return replaceInSource(sourceCode, allOpts);
}

export function removeImportInFile(
  filePath: string,
  opts: RemoveImportOptions,
) {
  const findNodeFn = (node: SourceFile) => {
    return findMatchingImportDeclarationsByFileRef(node, opts.importFileRef);
  };
  const allOpts = {
    checkFn: hasAnyImportDecl,
    findNodeFn,
    modifyFn: removeImport,
    ...opts,
  };
  return replaceInFile(filePath, allOpts);
}

export async function removeImportInTree(
  tree: Tree,
  opts: RemoveImportTreeOptions,
) {
  return await modifyTree(tree, opts);
}
