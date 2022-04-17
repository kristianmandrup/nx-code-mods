import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassPropertyDeclaration } from '../find';
import {
  removeCode,
  replaceInFile,
  AnyOpts,
  modifyTree,
  replaceInSource,
} from '../modify';
import { Node, SourceFile } from 'typescript';

export interface ClassPropertyRemoveOptions {
  classId: string;
  propertyId: string;
}

export interface ClassPropRemoveTreeOptions extends ClassPropertyRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const removeInClassScope = (opts: AnyOpts) => (node: Node) => {
  const { classId, propertyId } = opts;

  const propDecl = findClassPropertyDeclaration(node, {
    classId: classId,
    propertyId,
  });
  if (!propDecl) return;
  const startPos = propDecl.getStart();
  const endPos = propDecl.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeClassPropertyInSource(
  source: string,
  opts: ClassPropertyRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: removeInClassScope,
    ...opts,
  });
}

export function removeClassPropertyInFile(
  filePath: string,
  opts: ClassPropertyRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeInClassScope,
    ...opts,
  });
}

export async function removeClassPropertyInTree(
  tree: Tree,
  opts: ClassPropRemoveTreeOptions,
) {
  return await modifyTree(tree, opts);
}