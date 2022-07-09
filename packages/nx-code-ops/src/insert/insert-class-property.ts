import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findClassPropertyDeclaration,
  findFirstMethodDeclaration,
  findFirstPropertyDeclaration,
  findPropertyDeclaration,
} from '../find';
import {
  replaceInFile,
  AnyOpts,
  modifyTree,
  replaceInSource,
  InsertPosition,
} from '../modify';
import { SourceFile, Node } from 'typescript';
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

const getFirstTypeNode = findFirstPropertyDeclaration;

const insertClassProperty = (opts: AnyOpts) => (srcNode: any) => {
  const { propertyId, findNodeFn } = opts;
  const abortIfFound = (node: Node) =>
    findPropertyDeclaration(node, propertyId);
  const classDecl = findNodeFn(srcNode);
  if (!classDecl) return;
  if (abortIfFound && abortIfFound(classDecl)) {
    return;
  }
  return insertInClassScope(srcNode, {
    ...functionsMap,
    getFirstTypeNode,
    ...opts,
  });
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
