import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { removeCode } from './modify-code';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassMethodDeclaration } from './find';
import { SourceFile } from 'typescript';

export interface ClassMethodRemoveOptions {
  className: string;
  methodId: string;
}

export interface ClassMethodRemoveTreeOptions extends ClassMethodRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const removeInMethodBlock = (opts: AnyOpts) => (node: any) => {
  const { className, methodId } = opts;
  const methDecl = findClassMethodDeclaration(node, {
    classId: className,
    methodId,
  });
  if (!methDecl) return;
  const startPos = methDecl.getStart();
  const endPos = methDecl.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeClassMethodInFile(
  filePath: string,
  opts: ClassMethodRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeInMethodBlock,
    ...opts,
  });
}

export function removeClassMethodInTree(
  tree: Tree,
  opts: ClassMethodRemoveTreeOptions,
) {
  modifyTree(tree, opts);
}
