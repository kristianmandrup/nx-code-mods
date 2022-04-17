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
import { endOfIndex, startOfIndex } from '../positional';

export interface ClassPropertyRemoveOptions {
  classId: string;
  propertyId: string;
}

export interface ClassPropRemoveTreeOptions extends ClassPropertyRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const removeInClassScope = (opts: AnyOpts) => (srcNode: Node) => {
  const { classId, propertyId } = opts;

  const propDecl = findClassPropertyDeclaration(srcNode, {
    classId: classId,
    propertyId,
  });
  if (!propDecl) return;
  const startPos = startOfIndex(propDecl);
  const endPos = endOfIndex(propDecl);
  const positions = {
    startPos,
    endPos,
  };
  return removeCode(srcNode, positions);
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
