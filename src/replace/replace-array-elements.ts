import { Tree } from '@nrwl/devkit';
import {
  removeFromNamedArrayInSource,
  removeFromNamedArrayInFile,
  CollectionModifyOpts,
  removeFromNamedArrayInTree,
} from '../remove';
import { IndexAdj } from '../types';
export interface ReplaceArrayOptions {
  varId: string;
  code: string;
  replace?: CollectionModifyOpts;
  indexAdj?: IndexAdj;
}

export interface ReplaceArrayTreeOptions extends ReplaceArrayOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceInNamedArrayInSource(
  sourceCode: string,
  opts: ReplaceArrayOptions,
) {
  return removeFromNamedArrayInSource(sourceCode, opts);
}

export function replaceInNamedArrayInFile(
  targetFilePath: string,
  opts: ReplaceArrayOptions,
) {
  return removeFromNamedArrayInFile(targetFilePath, {
    remove: opts.replace,
    ...opts,
  });
}

export async function replaceInNamedArrayInTree(
  tree: Tree,
  opts: ReplaceArrayTreeOptions,
) {
  return await removeFromNamedArrayInTree(tree, {
    remove: opts.replace,
    ...opts,
  });
}
