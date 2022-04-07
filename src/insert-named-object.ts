import { insertCode } from './insert-code';
import { findDeclarationIdentifier } from './find';
import { Tree } from '@nrwl/devkit';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ArrayLiteralExpression,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  VariableStatement,
} from 'typescript';
import * as path from 'path';

export interface InsertObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
  id: string;
  codeToInsert: string;
  insertPos: ObjectPosition;
}

type ObjectPosition = 'start' | 'end' | string | number;

const insertIntoObject = (
  vsNode: any,
  objLiteral: ObjectLiteralExpression,
  codeToInsert: string,
  insertPos: ObjectPosition,
) => {
  const objSize = objLiteral.properties.length;
  if (objLiteral.properties.length == 0) return;
  const props = objLiteral.properties; // ObjectLiteralElementLike;
  let insertPosition;
  if (insertPos === 'start') {
    insertPosition = props[0].getStart();
  }

  if (Number.isInteger(insertPos)) {
    const insertPosNum = parseInt('' + insertPos);
    if (insertPosNum <= 0 || insertPosNum >= objSize) {
      throw new Error(
        `insertIntoObject: Invalid insertPos ${insertPos} argument`,
      );
    }
    insertPosition = props[insertPosNum].getStart();
  }

  if (insertPos === 'end') {
    const lastIndex = objLiteral.properties.length - 1;
    insertPosition = props[lastIndex].getEnd();
  }
  if (!insertPosition) {
    const matchingProp = objLiteral.properties.find(
      (prop: ObjectLiteralElementLike) =>
        prop.name?.getText() === '' + insertPos,
    );
    insertPosition = matchingProp?.getStart();
  }
  if (!insertPosition) return;
  return insertCode(vsNode, insertPosition, codeToInsert);
};

export const insertInObject = (
  node: any,
  id: string,
  codeToInsert: string,
  insertPos: ObjectPosition,
): string | undefined => {
  const vsNode = node as VariableStatement;
  const declaration = findDeclarationIdentifier(vsNode, id);
  if (!declaration) return node;
  const objLiteral = declaration.initializer as ObjectLiteralExpression;
  const newTxt = insertIntoObject(vsNode, objLiteral, codeToInsert, insertPos);
  return newTxt;
};

export function insertIntoNamedObject(
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    id,
    codeToInsert,
    insertPos,
  }: InsertObjectOptions,
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  if (targetFile !== '') {
    const ast = tsquery.ast(targetFile);
    const newContents = insertInObject(ast, id, codeToInsert, insertPos);

    if (newContents !== targetFile && newContents) {
      tree.write(targetFilePath, newContents);
    }
  }
}
