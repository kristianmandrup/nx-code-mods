import {
  removeCode,
  AnyOpts,
  replaceInFile,
  modifyTree,
  replaceInSource,
} from '../modify';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassMethodDeclaration } from '../find';
import { SourceFile } from 'typescript';
import { CollectionModifyOpts } from './positional';

export interface ClassMethodParamRemoveOptions {
  className: string;
  methodId: string;
  remove?: CollectionModifyOpts;
}

export interface ClassMethodParamRemoveTreeOptions
  extends ClassMethodParamRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const removeInMethodParams = (opts: AnyOpts) => (node: any) => {
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

export function removeClassMethodParamsInSource(
  source: string,
  opts: ClassMethodParamRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: removeInMethodParams,
    ...opts,
  });
}
export function removeClassMethodParamsInFile(
  filePath: string,
  opts: ClassMethodParamRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeInMethodParams,
    ...opts,
  });
}

export async function removeClassMethodParamsInTree(
  tree: Tree,
  opts: ClassMethodParamRemoveTreeOptions,
) {
  return await modifyTree(tree, opts);
}
