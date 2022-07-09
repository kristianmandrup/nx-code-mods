import { Tree } from '@nrwl/devkit';
import {
  removeClassMethodInFile,
  removeClassMethodInSource,
  removeClassMethodInTree,
} from '../remove';

export interface ClassMethodReplaceOptions {
  code: string;
  classId: string;
  methodId: string;
}

export interface ApiClassMethodReplaceOptions {
  classId?: string;
  methodId?: string;
  code: string;
}

export interface ClassMethodReplaceTreeOptions
  extends ClassMethodReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassMethodInSource(
  source: string,
  opts: ClassMethodReplaceOptions,
) {
  return removeClassMethodInSource(source, opts);
}
export function replaceClassMethodInFile(
  filePath: string,
  opts: ClassMethodReplaceOptions,
) {
  return removeClassMethodInFile(filePath, opts);
}

export async function replaceClassMethodInTree(
  tree: Tree,
  opts: ClassMethodReplaceTreeOptions,
) {
  return await removeClassMethodInTree(tree, opts);
}
