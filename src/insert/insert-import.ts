import { ensurePrefixComma, ensureSuffixComma } from './../ensure';
import { ImportClause, NamedImports, Node, SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
import {
  findImportSpecifier,
  findMatchingImportDecl,
  findMatchingImportDeclarationsByFileRef,
  hasAnyImportDecl,
} from '../find';
import { insertCode, modifyTree, AnyOpts, replaceInFile } from '../modify';
import {
  afterLastElementPos,
  aroundElementPos,
  CollectionInsert,
  getInsertPosNum,
  insertIntoNode,
} from './positional';

export interface InsertImportOptions {
  codeToInsert?: string;
  importId: string;
  importFileRef: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertImportTreeOptions extends InsertImportOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertImport = (opts: AnyOpts) => (srcNode: SourceFile) => {
  let { codeToInsert, insert, importId, importFileRef } = opts;
  const importDecl = findMatchingImportDecl(srcNode, {
    importId,
    importFileRef,
  });
  if (!importDecl) {
    return;
  }
  codeToInsert = codeToInsert || importId;
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
    codeToInsert,
    insert,
    ...opts,
  });
};

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
