import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { insertCode } from './insert-code';
import { findDeclarationIdentifier } from './find';
import { Tree } from '@nrwl/devkit';

import { ArrayLiteralExpression, Node, VariableStatement } from 'typescript';

export interface InsertArrayOptions {
  projectRoot: string;
  relTargetFilePath: string;
  id: string;
  codeToInsert: string;
  insertPos: ArrayPosition;
  indexAdj?: number;
}

type ArrayPosition = 'start' | 'end' | number;

export const insertIntoArray = (
  node: any,
  opts: AnyOpts,
): string | undefined => {
  const { arrLiteral, codeToInsert, insertPos, indexAdj } = opts;
  const arrLength = arrLiteral.elements.length;
  if (arrLiteral.elements.length == 0) return;
  const nodeArray = arrLiteral.elements;
  let insertPosition = nodeArray[0].getStart();
  if (Number.isInteger(insertPos)) {
    const insertPosNum = parseInt('' + insertPos);
    if (insertPosNum <= 0 || insertPosNum >= arrLength) {
      throw new Error(
        `insertIntoArray: Invalid insertPos ${insertPos} argument`,
      );
    }
    insertPosition = nodeArray[insertPosNum].getStart() + (indexAdj || 0);
  }

  if (insertPos === 'end') {
    const lastIndex = arrLiteral.elements.length - 1;
    insertPosition = nodeArray[lastIndex].getEnd();
  }
  return insertCode(node, insertPosition, codeToInsert);
};

export const insertInArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (node: Node): string | null | undefined => {
    const { id, codeToInsert, insertPos } = opts;
    const vsNode = node as VariableStatement;
    const declaration = findDeclarationIdentifier(vsNode, id);
    if (!declaration) return;
    const arrLiteral = declaration.initializer as ArrayLiteralExpression;

    const newTxt = insertIntoArray(vsNode, {
      arrLiteral,
      codeToInsert,
      insertPos,
    });
    return newTxt;
  };

export function insertIntoNamedArrayInFile(
  filePath: string,
  opts: InsertArrayOptions,
) {
  return replaceInFile(filePath, 'VariableStatement', insertInArray, opts);
}

export function insertIntoNamedArrayInTree(
  tree: Tree,
  opts: InsertArrayOptions,
) {
  return modifyTree(tree, 'VariableStatement', insertInArray, opts);
}
