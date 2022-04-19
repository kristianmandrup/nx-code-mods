import { CollectionReplace } from './positional';
import { Tree } from '@nrwl/devkit';
import {
  removeClassMethodParamsInFile,
  removeClassMethodParamsInSource,
  removeClassMethodParamsInTree,
} from '../remove';

export interface ClassMethodParamReplaceOptions {
  code: string;
  classId: string;
  methodId: string;
  replace?: CollectionReplace;
}

export interface ApiClassMethodParamReplaceOptions {
  classId?: string;
  methodId?: string;
  replace?: CollectionReplace;
  code: string;
}

export interface ClassMethodParamReplaceTreeOptions
  extends ClassMethodParamReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassMethodParamsInSource(
  source: string,
  opts: ClassMethodParamReplaceOptions,
) {
  return removeClassMethodParamsInSource(source, {
    remove: opts.replace,
    ...opts,
  });
}
export function replaceClassMethodParamsInFile(
  filePath: string,
  opts: ClassMethodParamReplaceOptions,
) {
  return removeClassMethodParamsInFile(filePath, {
    remove: opts.replace,
    ...opts,
  });
}

export async function replaceClassMethodParamsInTree(
  tree: Tree,
  opts: ClassMethodParamReplaceTreeOptions,
) {
  return await removeClassMethodParamsInTree(tree, {
    remove: opts.replace,
    ...opts,
  });
}
