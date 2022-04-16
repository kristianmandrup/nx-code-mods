import { Tree } from '@nrwl/devkit';
import {
  removeClassPropertyInFile,
  removeClassPropertyInSource,
  removeClassPropertyInTree,
} from '../remove';

export interface ClassPropertyReplaceOptions {
  replacementCode: string;
  classId: string;
  propId: string;
}

export interface ClassPropertyReplaceTreeOptions
  extends ClassPropertyReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassPropertyInSource(
  source: string,
  opts: ClassPropertyReplaceOptions,
) {
  return removeClassPropertyInSource(source, opts);
}
export function replaceClassPropertyInFile(
  filePath: string,
  opts: ClassPropertyReplaceOptions,
) {
  return removeClassPropertyInFile(filePath, opts);
}

export async function replaceClassPropertyInTree(
  tree: Tree,
  opts: ClassPropertyReplaceTreeOptions,
) {
  return await removeClassPropertyInTree(tree, opts);
}
