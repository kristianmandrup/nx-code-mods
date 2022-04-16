import { Tree } from '@nrwl/devkit';
import {
  removeClassDecoratorInFile,
  removeClassDecoratorInSource,
  removeClassDecoratorInTree,
} from '../remove';
export interface ClassDecoratorReplaceOptions {
  replacementCode: string;
  classId: string;
  id: string;
}

export interface ClassDecoratorReplaceTreeOptions
  extends ClassDecoratorReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassDecoratorInSource(
  sourceCode: string,
  opts: ClassDecoratorReplaceOptions,
) {
  return removeClassDecoratorInSource(sourceCode, opts);
}

export function replaceClassDecoratorInFile(
  targetFilePath: string,
  opts: ClassDecoratorReplaceOptions,
) {
  return removeClassDecoratorInFile(targetFilePath, opts);
}

export async function replaceClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecoratorReplaceTreeOptions,
) {
  return await removeClassDecoratorInTree(tree, opts);
}
