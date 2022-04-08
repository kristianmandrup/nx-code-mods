import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { SourceFile } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';

export interface ModifyFileOptions {
  projectRoot: string;
  relTargetFilePath: string;
  codeToInsert: string;
  [key: string]: any;
}

export type AnyOpts = {
  [key: string]: any;
};

export type ModifyFn = (opts: AnyOpts) => TSQueryStringTransformer;

export function modifyFileContents(
  targetFile: string,
  selector: string,
  modifyFn: ModifyFn,
  opts: ModifyFileOptions,
) {
  if (targetFile == '') return;
  const replaceFn = modifyFn({ ...opts });
  return tsquery.replace(targetFile, selector, replaceFn);
}

export function modifyFile(
  targetFilePath: string,
  selector: string,
  modifyFn: ModifyFn,
  opts: ModifyFileOptions,
) {
  const targetFile = readFileIfExisting(targetFilePath);
  return modifyFileContents(targetFile, selector, modifyFn, opts);
}

export function modifyTree(
  tree: Tree,
  selector: string,
  modifyFn: ModifyFn,
  opts: ModifyFileOptions,
) {
  const { projectRoot, relTargetFilePath } = opts;
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);
  const newContents = modifyFile(targetFilePath, selector, modifyFn, opts);
  if (newContents !== targetFile && newContents) {
    tree.write(targetFilePath, newContents);
  }
}
