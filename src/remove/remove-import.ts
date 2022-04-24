import { SourceFile, ImportDeclaration } from 'typescript';
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
import { afterIndex, beforeIndex } from '../positional';

export interface RemoveImportOptions {
  importId: string;
  importFileRef: string;
  multiple?: boolean;
}

export interface ApiRemoveImportOptions {
  importId?: string;
  importFileRef?: string;
}
export interface RemoveImportTreeOptions extends RemoveImportOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeImportDeclCode = (
  node: any,
  importDecl: ImportDeclaration,
) => {
  const startPos = importDecl.getStart();
  const endPos = importDecl.getEnd();
  const positions = {
    startPos,
    endPos,
  };
  return removeCode(node, positions);
};

export const removeImport = (opts: AnyOpts) => (node: any) => {
  let { importId, importFileRef } = opts;
  const importDecl = findMatchingImportDecl(node, { importId, importFileRef });
  if (!importDecl) {
    return;
  }
  return removeImportDeclCode(node, importDecl);
};

export const removeImports = (opts: AnyOpts) => (node: any) => {
  let { importFileRef } = opts;
  const importDeclarations = findMatchingImportDeclarationsByFileRef(
    node,
    importFileRef,
  );
  if (!importDeclarations || importDeclarations.length === 0) {
    return;
  }
  let code;
  importDeclarations.map((importDecl: ImportDeclaration) => {
    code = removeImportDeclCode(node, importDecl);
  });
  return code;
};

export function removeImportInSource(
  sourceCode: string,
  opts: RemoveImportOptions,
) {
  const findNodeFn = (node: SourceFile) => {
    return findMatchingImportDeclarationsByFileRef(node, opts.importFileRef);
  };
  const modifyFn = opts.multiple ? removeImports : removeImport;
  const allOpts = {
    checkFn: hasAnyImportDecl,
    findNodeFn,
    modifyFn,
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
