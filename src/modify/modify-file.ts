import { tsquery } from '@phenomnomnominal/tsquery';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { formatFiles, Tree } from '@nrwl/devkit';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { replaceOne, replaceSource, TSQuerySourceTransformer } from './replace';
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
  modifyFn?: ModifyFn;
  modifySrcFn?: ModifySrcFn;
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
export type ModifySrcFn = (opts: AnyOpts) => TSQuerySourceTransformer;

export function replaceNodeContents(
  source: string,
  node: Node,
  opts: ModifyFileOptions,
) {
  const { modifyFn } = opts;
  if (!modifyFn) {
    throw new Error('replaceNodeContents must take either a modifyFn function');
  }
  if (source == '') {
    return;
  }
  if (modifyFn) {
    const replaceFn = modifyFn({ ...opts });
    return replaceOne(source, node, replaceFn);
  }
}

export function replaceSrcContents(source: string, opts: ModifyFileOptions) {
  const { modifySrcFn } = opts;
  if (!modifySrcFn) {
    throw new Error(
      'replaceSrcContents must take either a modifySrcFn function',
    );
  }
  if (source == '') {
    return;
  }
  if (modifySrcFn) {
    const replaceFn = modifySrcFn({ ...opts });
    return replaceSource(source, replaceFn);
  }
}

export function findAndReplaceNodeContents(
  targetFile: string,
  ast: SourceFile,
  opts: ModifyFileOptions,
) {
  const { findNodeFn } = opts;
  if (!findNodeFn) return;
  const node = findNodeFn(ast);
  if (!node || (node as Node[]).length === 0) {
    return targetFile;
  }
  return replaceNodeContents(targetFile, ast, opts);
}

export function replaceContentInSrc(
  source: string,
  ast: SourceFile,
  opts: ModifyFileOptions,
) {
  return (
    findAndReplaceNodeContents(source, ast, opts) ||
    replaceSrcContents(source, opts)
  );
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

export const saveAndFormatTree = async (opts: any) => {
  const { format, tree } = opts;
  saveTree(opts);
  if (format) {
    await formatFiles(tree);
  }
};

export async function modifyTree(tree: Tree, opts: ModifyTreeOptions) {
  const { projectRoot, relTargetFilePath } = opts;
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);
  const newContents = replaceInFile(targetFilePath, opts);
  await saveAndFormatTree({
    tree,
    targetFile,
    targetFilePath,
    newContents,
    ...opts,
  });
  return newContents;
}
