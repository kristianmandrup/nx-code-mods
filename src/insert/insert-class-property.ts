import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findClassPropertyDeclaration,
  findFirstMethodDeclaration,
  findFirstPropertyDeclaration,
} from '../find';
import { replaceInFile, AnyOpts, modifyTree, replaceInSource } from '../modify';
import { SourceFile } from 'typescript';
import { startOfIndex, afterIndex } from '../positional';
import { insertInClassScope } from './positional';

export interface ClassPropertyInsertOptions {
  classId: string;
  propertyId: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
  code: string;
}

export interface ApiClassPropertyInsertOptions {
  classId?: string;
  propertyId?: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
  code: string;
}
export interface ClassPropertyInsertTreeOptions
  extends ClassPropertyInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const functionsMap = {
  defaultIndex: startOfIndex,
  nodeIndex: afterIndex,
  findMatchingNode: findClassPropertyDeclaration,
  findPivotNode: findFirstPropertyDeclaration,
  findAltPivotNode: findFirstMethodDeclaration,
};

const insertClassProperty = (opts: AnyOpts) => (srcNode: any) => {
  return insertInClassScope(srcNode, { ...functionsMap, ...opts });
};

export function insertClassPropertyInSource(
  source: string,
  opts: ClassPropertyInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertClassProperty,
    ...opts,
  });
}

export function insertClassPropertyInFile(
  filePath: string,
  opts: ClassPropertyInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertClassProperty,
    ...opts,
  });
}

export async function insertClassPropertyertyInTree(
  tree: Tree,
  opts: ClassPropertyInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
