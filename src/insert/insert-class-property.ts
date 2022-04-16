import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findClassPropertyDeclaration,
  findFirstMethodDeclaration,
  findFirstPropertyDeclaration,
} from '../find';
import { insertCode, replaceInFile, AnyOpts, modifyTree } from '../modify';
import { Node, SourceFile } from 'typescript';
import { ensureStmtClosing } from '../ensure';
import { insertInClassScope } from './positional';

export interface ClassPropInsertOptions {
  classId: string;
  propId: string;
  codeToInsert: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
}

export interface ClassPropInsertTreeOptions extends ClassPropInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const functionsMap = {
  findMatchingNode: findClassPropertyDeclaration,
  findPivotNode: findFirstPropertyDeclaration,
  findAltPivotNode: findFirstMethodDeclaration,
};

const insertClassProperty = (opts: AnyOpts) => (srcNode: SourceFile) => {
  return insertInClassScope(srcNode, { ...functionsMap, ...opts });
};

export function insertClassPropertyInFile(
  filePath: string,
  opts: ClassPropInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertClassProperty,
    ...opts,
  });
}

export async function insertClassPropertyInTree(
  tree: Tree,
  opts: ClassPropInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
