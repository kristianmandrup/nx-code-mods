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

export interface ClassMethodParamReplaceTreeOptions
  extends ClassMethodParamReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassMethodParamsInSource(
  source: string,
  opts: ClassMethodParamReplaceOptions,
) {
  return removeClassMethodParamsInSource(source, opts);
}
export function replaceClassMethodParamsInFile(
  filePath: string,
  opts: ClassMethodParamReplaceOptions,
) {
  return removeClassMethodParamsInFile(filePath, opts);
}

export async function replaceClassMethodParamsInTree(
  tree: Tree,
  opts: ClassMethodParamReplaceTreeOptions,
) {
  return await removeClassMethodParamsInTree(tree, opts);
}
