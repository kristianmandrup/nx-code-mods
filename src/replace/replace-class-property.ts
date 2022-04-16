import { Tree } from '@nrwl/devkit';
import { removeClassPropertyInTree } from '../remove';

export interface ClassPropertyReplaceOptions {
  classId: string;
  propId: string;
}

export interface ClassPropertyReplaceTreeOptions
  extends ClassPropertyReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export async function replaceClassPropertyInTree(
  tree: Tree,
  opts: ClassPropertyReplaceTreeOptions,
) {
  return await removeClassPropertyInTree(tree, opts);
}
