import { ensurePrefixComma, ensureSuffixComma } from './../ensure';
import {
  afterLastElementPos,
  aroundElementPos,
  CollectionInsert,
  getInsertPosNum,
  insertIntoNode,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { insertCode, AnyOpts, replaceInFile, modifyTree } from '../modify';
import { findVariableDeclaration } from '../find';
import { Tree } from '@nrwl/devkit';

import { ArrayLiteralExpression, SourceFile } from 'typescript';
export interface InsertArrayOptions {
  id: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertArrayTreeOptions extends InsertArrayOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertInArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, codeToInsert, insert } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const node = declaration.initializer as ArrayLiteralExpression;
    return insertIntoNode(srcNode, {
      elementsField: 'elements',
      node,
      codeToInsert,
      insert,
    });
  };

export function insertIntoNamedArrayInFile(
  filePath: string,
  opts: InsertArrayOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.id);
  return replaceInFile(filePath, {
    ...opts,
    findNodeFn,
    modifyFn: insertInArray,
  });
}

export async function insertIntoNamedArrayInTree(
  tree: Tree,
  opts: InsertArrayTreeOptions,
) {
  return await modifyTree(tree, opts);
}
