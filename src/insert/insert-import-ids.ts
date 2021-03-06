import { ImportClause, NamedImports, Node, SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
import {
  findImportSpecifier,
  findMatchingImportDecl,
  findMatchingImportDeclarationsByFileRef,
  hasAnyImportDecl,
} from '../find';
import { modifyTree, AnyOpts, replaceInFile, replaceInSource } from '../modify';
import { CollectionInsert, insertIntoNode } from './positional';

export interface InsertImportOptions {
  importId: string;
  importFileRef: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}

export interface ApiInsertImportOptions {
  importId?: string;
  importFileRef?: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}
export interface InsertImportTreeOptions extends InsertImportOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertImport = (opts: AnyOpts) => (srcNode: any) => {
  let { code, insert, importId, importFileRef } = opts;
  const importDecl = findMatchingImportDecl(srcNode, {
    importId,
    importFileRef,
  });
  if (!importDecl) {
    return;
  }
  code = code || importId;
  insert = insert || {};
  // const { abortIfFound } = insert;
  const importClause = importDecl.importClause as ImportClause;
  const abortIfFound = (node: Node) => findImportSpecifier(node, importId);
  if (!importClause) return;
  if (abortIfFound && abortIfFound(importClause)) {
    return;
  }
  const namedBindings: any = importDecl.importClause?.namedBindings;
  if (!namedBindings) {
    return;
  }
  if (!namedBindings['elements']) return;
  const node: NamedImports = namedBindings;
  return insertIntoNode(srcNode, {
    elementsField: 'elements',
    node,
    code,
    insert,
    ...opts,
  });
};

export function insertImportInSource(
  source: string,
  opts: InsertImportOptions,
) {
  const findNodeFn = (node: SourceFile) => {
    return findMatchingImportDeclarationsByFileRef(node, opts.importFileRef);
  };
  const allOpts = {
    checkFn: hasAnyImportDecl,
    findNodeFn,
    modifyFn: insertImport,
    ...opts,
  };
  return replaceInSource(source, allOpts);
}

export function insertImportInFile(
  filePath: string,
  opts: InsertImportOptions,
) {
  const findNodeFn = (node: SourceFile) => {
    return findMatchingImportDeclarationsByFileRef(node, opts.importFileRef);
  };
  const allOpts = {
    checkFn: hasAnyImportDecl,
    findNodeFn,
    modifyFn: insertImport,
    ...opts,
  };
  return replaceInFile(filePath, allOpts);
}

export async function insertImportInTree(
  tree: Tree,
  opts: InsertImportTreeOptions,
) {
  return await modifyTree(tree, opts);
}
