import { Tree } from '@nrwl/devkit';
import {
  removeImportIdInFile,
  removeImportIdInSource,
  removeImportIdInTree,
} from '../remove';

export interface ReplaceImportIdOptions {
  code: string;
  importId: string;
  importFileRef: string;
}

export interface ApiReplaceImportIdOptions {
  importId?: string;
  importFileRef?: string;
  code: string;
}

export interface ReplaceImportIdTreeOptions extends ReplaceImportIdOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceImportIdInSource(
  source: string,
  opts: ReplaceImportIdOptions,
) {
  return removeImportIdInSource(source, opts);
}
export function replaceImportIdInFile(
  filePath: string,
  opts: ReplaceImportIdOptions,
) {
  return removeImportIdInFile(filePath, opts);
}

export async function replaceImportIdInTree(
  tree: Tree,
  opts: ReplaceImportIdTreeOptions,
) {
  return await removeImportIdInTree(tree, opts);
}
