import { replaceInFile, modifyTree, replaceInSource } from '../modify';
import { Tree } from '@nrwl/devkit';
import { findClassDeclaration } from '../find';
import { SourceFile } from 'typescript';
import { CollectionModifyOpts, removeMethodParamDecorators } from '../remove';

export interface ClassMethodParamDecoratorReplaceOptions {
  classId: string;
  methodId: string;
  paramId: string;
  replace?: CollectionModifyOpts;
  code: string;
}

export interface ApiClassMethodParamDecoratorReplaceOptions {
  classId?: string;
  methodId?: string;
  paramId?: string;
  replace?: CollectionModifyOpts;
  code: string;
}

export interface ClassMethodParamDecoratorReplaceTreeOptions
  extends ClassMethodParamDecoratorReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassMethodParamDecoratorsInSource(
  source: string,
  opts: ClassMethodParamDecoratorReplaceOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: removeMethodParamDecorators,
    remove: opts.replace,
    ...opts,
  });
}

export function replaceClassMethodParamDecoratorsInFile(
  filePath: string,
  opts: ClassMethodParamDecoratorReplaceOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeMethodParamDecorators,
    remove: opts.replace,
    ...opts,
  });
}

export async function replaceClassMethodParamDecoratorsInTree(
  tree: Tree,
  opts: ClassMethodParamDecoratorReplaceTreeOptions,
) {
  return await modifyTree(tree, {
    remove: opts.replace,
    ...opts,
  });
}
