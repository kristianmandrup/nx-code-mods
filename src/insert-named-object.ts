import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { insertCode } from './insert-code';
import { findDeclarationIdentifier } from './find';
import { Tree } from '@nrwl/devkit';
import { Node } from 'typescript';

import {
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  VariableStatement,
} from 'typescript';
import * as path from 'path';
import { AnyOpts, modifyFile } from './modify-file';

export interface InsertObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
  id: string;
  codeToInsert: string;
  insertPos: ObjectPosition;
  indexAdj?: number;
}

type ObjectPosition = 'start' | 'end' | string | number;

const insertIntoObject = (
  vsNode: any,
  objLiteral: ObjectLiteralExpression,
  codeToInsert: string,
  insertPos: ObjectPosition,
  indexAdj?: number,
): string | null => {
  const objSize = objLiteral.properties.length;
  if (objLiteral.properties.length == 0) return null;
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
  if (!insertPosition) return null;
  insertPosition = insertPosition + (indexAdj || 0);
  return insertCode(vsNode, insertPosition, codeToInsert);
};

export type InsertInObjectFn = {
  id: string;
  codeToInsert: string;
  insertPos: ObjectPosition;
  indexAdj?: number;
};

export const insertInObject =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (node: Node): string | null | undefined => {
    const { id, codeToInsert, insertPos } = opts;
    const vsNode = node as VariableStatement;
    const declaration = findDeclarationIdentifier(vsNode, id);
    if (!declaration) return;
    const objLiteral = declaration.initializer as ObjectLiteralExpression;
    const newTxt = insertIntoObject(
      vsNode,
      objLiteral,
      codeToInsert,
      insertPos,
    );
    return newTxt;
  };

export function insertIntoNamedObject(tree: Tree, opts: InsertObjectOptions) {
  modifyFile(tree, 'VariableStatement', insertInObject, opts);
}
