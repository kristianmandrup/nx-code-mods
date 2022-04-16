import { Tree } from '@nrwl/devkit';
import {
  CollectionModifyOpts,
  removeInsideFunctionBlockInFile,
  removeInsideFunctionBlockInSource,
  removeInsideFunctionBlockInTree,
} from '../remove';

export interface ReplaceInsideFunctionBlockOptions {
  id: string;
  replacementCode: string;
  replace?: CollectionModifyOpts;
  indexAdj?: number;
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
