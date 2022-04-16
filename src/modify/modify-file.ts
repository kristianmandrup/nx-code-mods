import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { formatFiles, Tree } from '@nrwl/devkit';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { replaceOne } from './replace';
import { Node, SourceFile } from 'typescript';

export type GetDefaultNodeFn = (node: SourceFile) => Node;
export type FindNodeFn = (node: SourceFile) => Node | Node[] | undefined;
export type CheckFn = (node: SourceFile) => boolean;

export interface ModifyFileOptions {
  codeToInsert?: string;
  selector?: string;
  checkFn?: CheckFn;
  findNodeFn?: FindNodeFn;
  getDefaultNodeFn?: GetDefaultNodeFn;
  [key: string]: any;
}

export interface ModifyTreeOptions extends ModifyFileOptions {
  projectRoot: string;
  relTargetFilePath: string;
  format?: boolean;
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
    if (!node || (node as Node[]).length === 0) {
      return targetFile;
    }
    return replaceNodeContents(targetFile, ast, opts);
  }
  if (!selector) {
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
  return replaceInSource(targetFile, opts);
}

export function replaceInSource(sourceCode: string, opts: ModifyFileOptions) {
  const ast = tsquery.ast(sourceCode);
  const { checkFn, getDefaultNodeFn } = opts;
  if (checkFn) {
    const checkResult = checkFn(ast);
    if (checkResult) {
      return replaceContentInSrc(sourceCode, ast, opts);
    } else {
      if (getDefaultNodeFn) {
        const node = getDefaultNodeFn(ast);
        return replaceNodeContents(sourceCode, node, opts);
      }
    }
  }
  return replaceContentInSrc(sourceCode, ast, opts);
}

export const saveTree = ({
  tree,
  targetFile,
  targetFilePath,
  newContents,
}: any) => {
  if (!newContents || newContents == targetFile) return;
  tree.write(targetFilePath, newContents);
};

export async function modifyTree(tree: Tree, opts: ModifyTreeOptions) {
  const { projectRoot, relTargetFilePath, format } = opts;
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);
  const newContents = replaceInFile(targetFilePath, opts);
  saveTree({
    tree,
    targetFile,
    targetFilePath,
    newContents,
  });
  if (format) {
    await formatFiles(tree);
  }
  return newContents;
}
