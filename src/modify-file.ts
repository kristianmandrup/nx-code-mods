import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { replaceOne } from './replace';
import { Node, SourceFile } from 'typescript';

export type GetDefaultNodeFn = (node: SourceFile) => Node;
export type FindNodeFn = (node: SourceFile) => Node | undefined;
export type CheckFn = (node: SourceFile) => boolean;

export interface ModifyFileOptions {
  codeToInsert: string;
  selector?: string;
  checkFn?: CheckFn;
  findNodeFn?: FindNodeFn;
  getDefaultNodeFn?: GetDefaultNodeFn;
  [key: string]: any;
}

export interface ModifyTreeOptions extends ModifyFileOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export type AnyOpts = {
  [key: string]: any;
};

export type ModifyFn = (opts: AnyOpts) => TSQueryStringTransformer;

export function replaceFileContents(
  targetFile: string,
  opts: ModifyFileOptions,
) {
  const { modifyFn, selector } = opts;
  if (targetFile == '') {
    console.log('targetFile is empty', { targetFile });
    return;
  }
  const replaceFn = modifyFn({ ...opts });
  if (!selector) return targetFile;
  return tsquery.replace(targetFile, selector, replaceFn);
}

export function replaceNodeContents(
  targetFile: string,
  node: Node,
  opts: ModifyFileOptions,
) {
  const { modifyFn } = opts;
  if (targetFile == '') {
    console.log('targetFile is empty', { targetFile });
    return;
  }
  const replaceFn = modifyFn({ ...opts });
  return replaceOne(targetFile, node, replaceFn);
}

export function replaceContentInSrc(
  targetFile: string,
  ast: SourceFile,
  opts: ModifyFileOptions,
) {
  const { selector, findNodeFn } = opts;
  if (findNodeFn) {
    const node = findNodeFn(ast);
    if (!node) {
      // console.log('no matching node');
      return targetFile;
    }
    return replaceNodeContents(targetFile, ast, opts);
  }
  if (!selector) {
    // console.log('no selector');
    return targetFile;
  }
  return replaceFileContents(targetFile, opts);
}

export function replaceInFile(targetFilePath: string, opts: ModifyFileOptions) {
  const targetFile = readFileIfExisting(targetFilePath);
  if (!targetFile || targetFile === '') {
    console.log('no such file', targetFilePath);
    return;
  }
  const ast = tsquery.ast(targetFile);
  const { checkFn, getDefaultNodeFn } = opts;
  if (checkFn) {
    // console.log('check');
    const checkResult = checkFn(ast);
    // console.log({ checkResult });
    if (checkResult) {
      return replaceContentInSrc(targetFile, ast, opts);
    } else {
      // console.log('default');
      if (getDefaultNodeFn) {
        const node = getDefaultNodeFn(ast);
        return replaceNodeContents(targetFile, node, opts);
      }
    }
  }
  return replaceContentInSrc(targetFile, ast, opts);
}

export function modifyTree(tree: Tree, opts: ModifyTreeOptions) {
  const { projectRoot, relTargetFilePath } = opts;
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);
  const newContents = replaceInFile(targetFilePath, opts);
  if (newContents !== targetFile && newContents) {
    tree.write(targetFilePath, newContents);
  }
  return newContents;
}
