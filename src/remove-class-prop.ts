import { removeCode } from './modify-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassPropertyDeclaration } from './find';
import { replaceInFile, AnyOpts, modifyTree } from './modify-file';
import { Node, SourceFile } from 'typescript';

export interface ClassPropRemoveOptions {
  className: string;
  propId: string;
}

export interface ClassPropRemoveTreeOptions extends ClassPropRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const removeInClassScope = (opts: AnyOpts) => (node: Node) => {
  const { className, propId } = opts;

  const propDecl = findClassPropertyDeclaration(node, {
    classId: className,
    propId,
  });
  if (!propDecl) return;
  const startPos = propDecl.getStart();
  const endPos = propDecl.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeClassPropertyInFile(
  filePath: string,
  opts: ClassPropRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeInClassScope,
    ...opts,
  });
}

export function removeClassPropertyInTree(
  tree: Tree,
  opts: ClassPropRemoveTreeOptions,
) {
  return modifyTree(tree, opts);
}
