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

export const insertImport = (opts: AnyOpts) => (node: any) => {
  let { codeToInsert, insert, indexAdj, importId, importFileRef } = opts;
  const importDecl = findMatchingImportDecl(node, { importId, importFileRef });
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
  const { elements } = namedBindings as NamedImports;
  const count = elements.length;
  let insertPosNum =
    getInsertPosNum({
      node: importDecl,
      elements,
      insert,
      count,
    }) || 0;

  if (count === 0) {
    let insertPosition = importDecl.getStart() + 1;
    insertPosition += indexAdj || 0;
    const code = ensureSuffixComma(codeToInsert);
    return insertCode(node, insertPosition, code);
  }
  if (insertPosNum === -1) {
    insertPosNum = 0;
    insert.relative = 'before';
  }

  let insertPosition =
    insertPosNum >= count
      ? afterLastElementPos(elements)
      : aroundElementPos(elements, insertPosNum, insert.relative);

  const shouldInsertAfter =
    insertPosNum === count || insert.relative === 'after';
  const code = shouldInsertAfter
    ? ensurePrefixComma(codeToInsert)
    : ensureSuffixComma(codeToInsert);
  insertPosition += indexAdj || 0;
  return insertCode(node, insertPosition, code);
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

export function insertImportInTree(tree: Tree, opts: InsertImportTreeOptions) {
  return modifyTree(tree, opts);
}
