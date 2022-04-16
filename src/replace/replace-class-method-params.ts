import { Tree } from '@nrwl/devkit';
import {
  removeClassMethodParamsInFile,
  removeClassMethodParamsInSource,
  removeClassMethodParamsInTree,
} from '../remove';

export interface ClassMethodParamReplaceOptions {
  classId: string;
  methodId: string;
}

export interface ClassMethodParamReplaceTreeOptions
  extends ClassMethodParamReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassMethodParamsInSource(
  source: string,
  opts: ClassMethodParamReplaceTreeOptions,
) {
  return removeClassMethodParamsInSource(source, opts);
}
export function replaceClassMethodParamsInFile(
  filePath: string,
  opts: ClassMethodParamReplaceTreeOptions,
) {
  return removeClassMethodParamsInFile(filePath, opts);
}

export async function replaceClassMethodParamsInTree(
  tree: Tree,
  opts: ClassMethodParamReplaceTreeOptions,
) {
  return await removeClassMethodParamsInTree(tree, opts);
}
