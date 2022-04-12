import { ImportClause, NamedImports, Node, SourceFile } from 'typescript';
import { removeCode } from './modify-code';
import { Tree } from '@nrwl/devkit';
import {
  findImportSpecifier,
  findMatchingImportDecl,
  findMatchingImportDeclarationsByFileRef,
  hasAnyImportDecl,
} from './find';
import { modifyTree, AnyOpts, replaceInFile } from './modify-file';

export interface RemoveImportIdOptions {
  importId: string;
  importFileRef: string;
}

export interface RemoveImportIdTreeOptions extends RemoveImportIdOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeImportId = (opts: AnyOpts) => (node: any) => {
  let { importId, importFileRef } = opts;
  const importDecl = findMatchingImportDecl(node, { importId, importFileRef });
  if (!importDecl) {
    return;
  }
  // const { abortIfFound } = remove;
  const importSpec = findImportSpecifier(node, importId);
  if (!importSpec) return;

  const startPos = importSpec.getStart();
  const endPos = importSpec.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeImportIdInFile(
  filePath: string,
  opts: RemoveImportIdOptions,
) {
  const findNodeFn = (node: SourceFile) => {
    return findMatchingImportDeclarationsByFileRef(node, opts.importFileRef);
  };
  const allOpts = {
    checkFn: hasAnyImportDecl,
    findNodeFn,
    modifyFn: removeImportId,
    ...opts,
  };
  return replaceInFile(filePath, allOpts);
}

export function removeImportIdInTree(
  tree: Tree,
  opts: RemoveImportIdTreeOptions,
) {
  return modifyTree(tree, opts);
}
