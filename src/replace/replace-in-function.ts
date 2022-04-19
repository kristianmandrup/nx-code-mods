import { Tree } from '@nrwl/devkit';
import {
  CollectionModifyOpts,
  removeInsideFunctionBlockInFile,
  removeInsideFunctionBlockInSource,
  removeInsideFunctionBlockInTree,
} from '../remove';

export interface ReplaceInsideFunctionBlockOptions {
  functionId: string;
  code: string;
  replace?: CollectionModifyOpts;
  indexAdj?: number;
}

export interface ApiReplaceInsideFunctionBlockOptions {
  functionId?: string;
  replace?: CollectionModifyOpts;
  indexAdj?: number;
  code: string;
}

export interface ReplaceInsideFunctionBlockTreeOptions
  extends ReplaceInsideFunctionBlockOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceInsideFunctionBlockInSource(
  source: string,
  opts: ReplaceInsideFunctionBlockOptions,
) {
  return removeInsideFunctionBlockInSource(source, {
    remove: opts.replace,
    ...opts,
  });
}
export function replaceInsideFunctionBlockInFile(
  filePath: string,
  opts: ReplaceInsideFunctionBlockOptions,
) {
  return removeInsideFunctionBlockInFile(filePath, {
    remove: opts.replace,
    ...opts,
  });
}

export async function replaceInsideFunctionBlockInTree(
  tree: Tree,
  opts: ReplaceInsideFunctionBlockTreeOptions,
) {
  return await removeInsideFunctionBlockInTree(tree, {
    remove: opts.replace,
    ...opts,
  });
}
