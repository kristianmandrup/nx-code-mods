import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInFile, modifyTree } from './modify-file';
import { insertCode } from './insert-code';
import { findVariableDeclaration } from './find';
import { Tree } from '@nrwl/devkit';

import { ArrayLiteralExpression, Node, SourceFile } from 'typescript';

export interface InsertArrayOptions {
  id: string;
  codeToInsert: string;
  insertPos?: ArrayPosition;
  indexAdj?: number;
}

export interface InsertArrayTreeOptions extends InsertArrayOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

type ArrayPosition = 'start' | 'end' | number;

export const insertIntoArray = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { arrLiteral, codeToInsert, insertPos, indexAdj } = opts;
  insertPos = insertPos || 'start';
  const arrLength = arrLiteral.elements.length;
  let insertPosition;
  let code = codeToInsert;
  if (arrLiteral.elements.length == 0) {
    insertPosition = arrLiteral.getStart() + 1;
  } else {
    const nodeArray = arrLiteral.elements;
    insertPosition = nodeArray[0].getStart();
    if (Number.isInteger(insertPos)) {
      const insertPosNum = parseInt('' + insertPos);
      if (insertPosNum <= 0 || insertPosNum >= arrLength) {
        throw new Error(
          `insertIntoArray: Invalid insertPos ${insertPos} argument`,
        );
      }
      insertPosition = nodeArray[insertPosNum].getStart() + (indexAdj || 0);
      if (insertPosNum > 0) {
        code = codeToInsert.match(/^\s*,/) ? codeToInsert : ',' + codeToInsert;
      } else {
        code = codeToInsert.match(/\s*,$/) ? codeToInsert : codeToInsert + ',';
      }
    }
    if (insertPos === 'end') {
      const lastIndex = arrLiteral.elements.length - 1;
      insertPosition = nodeArray[lastIndex].getEnd();

      code = codeToInsert.match(/^\s*,/) ? codeToInsert : ',' + codeToInsert;
    }
    if (insertPos === 'start') {
      code = codeToInsert.match(/\s*,$/) ? codeToInsert : codeToInsert + ',';
    }
  }
  return insertCode(srcNode, insertPosition, code);
};

export const insertInArray =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { id, codeToInsert, insertPos } = opts;
    const declaration = findVariableDeclaration(srcNode, id);
    if (!declaration) {
      return;
    }
    const arrLiteral = declaration.initializer as ArrayLiteralExpression;
    const newTxt = insertIntoArray(srcNode, {
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
  const findNodeFn = (node: SourceFile) =>
    findVariableDeclaration(node, opts.id);
  return replaceInFile(filePath, {
    ...opts,
    findNodeFn,
    modifyFn: insertInArray,
  });
}

export function insertIntoNamedArrayInTree(
  tree: Tree,
  opts: InsertArrayTreeOptions,
) {
  return modifyTree(tree, opts);
}
