import { Tree } from '@nrwl/devkit';
import {
  removeFromNamedObjectInSource,
  removeFromNamedObjectInFile,
  CollectionModifyOpts,
  removeFromNamedObjectInTree,
} from '../remove';
import { IndexAdj } from '../types';
export interface ReplaceObjectOptions {
  id: string;
  replacementCode: string;
  replace?: CollectionModifyOpts;
  indexAdj?: IndexAdj;
}

export interface ReplaceObjectTreeOptions extends ReplaceObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceInNamedObjectInSource(
  sourceCode: string,
  opts: ReplaceObjectOptions,
) {
  return removeFromNamedObjectInSource(sourceCode, opts);
}

export function replaceInNamedObjectInFile(
  targetFilePath: string,
  opts: ReplaceObjectOptions,
) {
  return removeFromNamedObjectInFile(targetFilePath, {
    remove: opts.replace,
    ...opts,
  });
}

export async function replaceInNamedObjectInTree(
  tree: Tree,
  opts: ReplaceObjectTreeOptions,
) {
  return await removeFromNamedObjectInTree(tree, {
    remove: opts.replace,
    ...opts,
  });
}
