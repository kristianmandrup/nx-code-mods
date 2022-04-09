import {
  afterLastElementPos,
  beforeElementPos,
  CollectionInsert,
  ensurePrefixComma,
  ensureSuffixComma,
  getInsertPosNum,
} from './positional';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { insertCode } from './insert-code';
import { findVariableDeclaration } from './find';
import { Tree } from '@nrwl/devkit';
import { SourceFile } from 'typescript';
import { ObjectLiteralExpression } from 'typescript';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';

export interface InsertObjectOptions {
  id: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface InsertObjectTreeOptions extends InsertObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

// TODO: support BeforeOrAfter insertPos
export const insertIntoObject = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { literalExpr, codeToInsert, insert, indexAdj } = opts;
  const props = literalExpr.properties;
  const propCount = props.length;
  let insertPosNum =
    getInsertPosNum({
      literalExpr,
      elements: props,
      insert,
      count: propCount,
    }) || 0;
  if (propCount === 0) {
    const insertPosition = literalExpr.getStart() + 1;
    return insertCode(srcNode, insertPosition, codeToInsert);
  }
  const code =
    insertPosNum === propCount
      ? ensurePrefixComma(codeToInsert)
      : ensureSuffixComma(codeToInsert);
  let insertPosition =
    insertPosNum >= propCount
      ? afterLastElementPos(props)
      : beforeElementPos(props, insertPosNum);
  insertPosition += indexAdj || 0;
  return insertCode(srcNode, insertPosition, code);
};

export type InsertInObjectFn = {
  id: string;
  codeToInsert: string;
  insert: CollectionInsert;
  indexAdj?: number;
};

export const insertInObject =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, codeToInsert, insert } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const literalExpr = declaration.initializer as ObjectLiteralExpression;
    const newTxt = insertIntoObject(srcNode, {
      literalExpr,
      codeToInsert,
      insert,
    });
    return newTxt;
  };

export function insertIntoNamedObjectInFile(
  filePath: string,
  opts: InsertObjectOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.id);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertInObject,
    ...opts,
  });
}

export function insertIntoNamedObjectInTree(
  tree: Tree,
  opts: InsertObjectTreeOptions,
) {
  return modifyTree(tree, opts);
}
