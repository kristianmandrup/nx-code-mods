import { CollectionRemove } from './positional';
import { removeCode, AnyOpts, replaceInFile, modifyTree } from '../modify';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassMethodDeclaration } from '../find';
import { SourceFile } from 'typescript';

export interface ClassMethodParamDecoratorRemoveOptions {
  className: string;
  methodId: string;
  paramId: string;
  remove?: CollectionRemove;
}

export interface ClassMethodParamDecoratorRemoveTreeOptions
  extends ClassMethodParamDecoratorRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const removeInMethodParamDecorator = (opts: AnyOpts) => (node: any) => {
  const { className, methodId } = opts;
  const methDecl = findClassMethodDeclaration(node, {
    classId: className,
    methodId,
  });
  if (!methDecl) return;
  const parameters = methDecl.parameters;
  // TODO: use remove from opts to select which params to use as pivots for remove span
  const lastParamIndex = parameters.length - 1;
  const firstParam = parameters[0];
  const lastParam = parameters[lastParamIndex];
  const startPos = firstParam.getStart();
  const endPos = lastParam.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeClassMethodParamDecoratorsInFile(
  filePath: string,
  opts: ClassMethodParamDecoratorRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeInMethodParamDecorator,
    ...opts,
  });
}

export function removeClassMethodParamDecoratorsInTree(
  tree: Tree,
  opts: ClassMethodParamDecoratorRemoveTreeOptions,
) {
  modifyTree(tree, opts);
}
