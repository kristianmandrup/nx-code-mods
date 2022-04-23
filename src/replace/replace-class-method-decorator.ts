import { Tree } from '@nrwl/devkit';
import {
  removeClassMethodDecoratorInFile,
  removeClassMethodDecoratorInSource,
  removeClassMethodDecoratorInTree,
} from '../remove';

export interface ClassMethodDecoratorReplaceOptions {
  code: string;
  classId: string;
  methodId: string;
  decoratorId: string;
}

export interface ApiClassMethodDecoratorReplaceOptions {
  classId?: string;
  methodId?: string;
  decoratorId?: string;
  code: string;
}

export interface ClassMethodDecoratorReplaceTreeOptions
  extends ClassMethodDecoratorReplaceOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceClassMethodDecoratorInSource(
  source: string,
  opts: ClassMethodDecoratorReplaceOptions,
) {
  return removeClassMethodDecoratorInSource(source, {
    ...opts,
  });
}
export function replaceClassMethodDecoratorInFile(
  filePath: string,
  opts: ClassMethodDecoratorReplaceOptions,
) {
  return removeClassMethodDecoratorInFile(filePath, {
    ...opts,
  });
}

export async function replaceClassMethodDecoratorInTree(
  tree: Tree,
  opts: ClassMethodDecoratorReplaceTreeOptions,
) {
  return await removeClassMethodDecoratorInTree(tree, opts);
}
