import { isPresent } from './modify-code';
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

export interface ModifyOptions {
  code?: string;
  selector?: string;
  checkFn?: CheckFn;
  findNodeFn?: FindNodeFn;
  getDefaultNodeFn?: GetDefaultNodeFn;
  [key: string]: any;
}

export interface ModifyFileOptions extends ModifyOptions {
  modifyFn?: ModifyFn;
}

export interface ModifySrcOptions extends ModifyOptions {
  modifySrcFn?: ModifySrcFn;
}

export interface ModifyTreeOptions extends ModifyFileOptions {
  projectRoot: string;
  relTargetFilePath: string;
  format?: boolean;
}

export type AnyOpts = {
  [key: string]: any;
};

type TSSourceFileStringTransformer = (node: Node) => string | null | undefined;

export type ModifyFn = (
  opts: AnyOpts,
) => TSQueryStringTransformer | TSSourceFileStringTransformer;
export type ModifySrcFn = (opts: AnyOpts) => TSQuerySourceTransformer;

export function replaceNodeContents(
  source: string,
  node: Node,
  opts: ModifyFileOptions,
) {
  const { modifyFn } = opts;
  if (!modifyFn) {
    console.error('replaceNodeContents', opts);
    throw new Error('replaceNodeContents must take a modifyFn function');
  }
  if (source == '') {
    return;
  }
  if (modifyFn) {
    const replaceFn = modifyFn({ ...opts });
    return replaceOne(source, node, replaceFn);
  }
}

export function replaceSrcContents(source: string, opts: ModifySrcOptions) {
  const { modifySrcFn } = opts;
  if (!modifySrcFn) {
    // throw new Error('replaceSrcContents must take a modifySrcFn function');
    return source;
  }
  if (source == '') {
    return source;
  }
  if (modifySrcFn) {
    const replaceFn = modifySrcFn({ ...opts });
    return replaceSource(source, replaceFn);
  }
}

export function findAndReplaceNodeContents(
  targetFile: string,
  ast: SourceFile,
  opts: ModifyOptions,
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
  const frSrc = findAndReplaceNodeContents(source, ast, opts);
  if (isPresent(frSrc)) return frSrc;
  return replaceSrcContents(source, opts);
}

export function replaceInFile(filePath: string, opts: ModifyFileOptions) {
  const source = readFileIfExisting(filePath);
  if (!source || source === '') {
    console.log('no such file', filePath);
    return;
  }
  return replaceInSource(source, opts);
}

export interface ReplaceOpts {
  ast: SourceFile;
  sourceCode: string;
  opts: ModifyFileOptions;
}

const getNodeAndReplace = ({ ast, sourceCode, opts }: ReplaceOpts) => {
  const { getDefaultNodeFn } = opts;
  if (!getDefaultNodeFn) return;
  const node = getDefaultNodeFn(ast);
  return replaceNodeContents(sourceCode, node, opts);
};

const checkAndReplaceContent = ({ ast, sourceCode, opts }: ReplaceOpts) => {
  const { checkFn } = opts;
  if (!checkFn) return;
  const checkResult = checkFn(ast);
  return checkResult
    ? replaceContentInSrc(sourceCode, ast, opts)
    : getNodeAndReplace({ ast, sourceCode, opts });
};

export function replaceInSource(sourceCode: string, opts: ModifyFileOptions) {
  const ast = tsquery.ast(sourceCode);
  const crSrc = checkAndReplaceContent({ sourceCode, ast, opts });
  if (isPresent(crSrc)) return crSrc;
  return replaceContentInSrc(sourceCode, ast, opts);
}

type SaveTreeOpts = {
  tree: Tree;
  source: string;
  filePath: string;
  newContents: string;
};

interface SaveAndFormatTreeOpts extends SaveTreeOpts {
  format?: boolean;
}

export const saveTree = ({
  tree,
  source,
  filePath,
  newContents,
}: SaveTreeOpts) => {
  if (!newContents || newContents == source) return;
  tree.write(filePath, newContents);
};

export const saveAndFormatTree = async (opts: SaveAndFormatTreeOpts) => {
  const { format, tree } = opts;
  saveTree(opts);
  if (format) {
    await formatFiles(tree);
  }
};

export interface ReadNxSourceFileOpts {
  projectRoot: string;
  relTargetFilePath: string;
}

export const readNxSourceFile = (opts: ReadNxSourceFileOpts) => {
  const { projectRoot, relTargetFilePath } = opts;
  const filePath = path.join(projectRoot, relTargetFilePath);
  return readFileIfExisting(filePath);
};

export async function modifyTree(tree: Tree, opts: ModifyTreeOptions) {
  const { projectRoot, relTargetFilePath } = opts;
  const filePath = path.join(projectRoot, relTargetFilePath);
  const source = readFileIfExisting(filePath);
  const newContents = replaceInFile(filePath, opts);
  if (!newContents) return;

  await saveAndFormatTree({
    tree,
    source,
    filePath,
    newContents,
    ...opts,
  });
  return newContents;
}
