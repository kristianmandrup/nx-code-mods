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
    projectRoot: string
    relTargetFilePath: string
    targetIdName: string
    codeToInsert: string
    insertPos: ObjectPosition
}

type ObjectPosition = 'start' | 'end' | string | number;

const insertIntoObject = (vsNode: any, objLiteral: ObjectLiteralExpression, codeToInsert: string, insertPos: ObjectPosition) => {
  const objSize = objLiteral.properties.length
  if (objLiteral.properties.length == 0) return
  const props = objLiteral.properties // ObjectLiteralElementLike;
  let insertPosition;
  if (insertPos === 'start') {
    insertPosition = props[0].getStart();
  }

  if (Number.isInteger(insertPos)) {
    const insertPosNum = parseInt('' + insertPos)
    if (insertPosNum <=0 || insertPosNum >= objSize) {
      throw new Error(`insertIntoObject: Invalid insertPos ${insertPos} argument`)
    }
    insertPosition = props[insertPosNum].getStart();
  }

  if (insertPos === 'end') {
    const lastIndex = objLiteral.properties.length - 1;
    insertPosition = props[lastIndex].getEnd();
  }    
  if (!insertPosition) {
    const matchingProp = objLiteral.properties.find((prop: ObjectLiteralElementLike) => prop.name?.getText() === '' + insertPos)
    insertPosition = matchingProp?.getStart()
  }
  if (!insertPosition) return 
  return insertCode(vsNode, insertPosition, codeToInsert);  
}

export function insertIntoNamedObject(
  tree: Tree,
  { projectRoot, relTargetFilePath, targetIdName, codeToInsert, insertPos }: InsertObjectOptions
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  const replaceVarFn = (node: any) => {
    let modifiedNode = node.getFullText();
    const vsNode = node as VariableStatement;
    const declaration = findDeclarationIdentifier(vsNode, targetIdName);
    if (!declaration) return modifiedNode
    const objLiteral = declaration.initializer as ObjectLiteralExpression;
    const newTxt = insertIntoObject(vsNode, objLiteral, codeToInsert, insertPos);
    return newTxt;
  };

  if (targetFile !== '') {
    const newContents = tsquery.replace(
      targetFile,
      'VariableStatement',
      replaceVarFn
    );

    if (newContents !== targetFile) {
      tree.write(targetFilePath, newContents);
    }
  }
}
