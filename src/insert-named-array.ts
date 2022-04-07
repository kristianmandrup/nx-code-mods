import { insertCode } from './insert-code';
import { findDeclarationIdentifier } from './find';
import { Tree } from '@nrwl/devkit';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ArrayLiteralExpression,
  VariableStatement,
} from 'typescript';
import * as path from 'path';

export interface InsertArrayOptions { 
    projectRoot: string
    relTargetFilePath: string
    targetIdName: string
    codeToInsert: string
    insertPos: ArrayPosition
}

type ArrayPosition = 'start' | 'end' | number;

const insertIntoArray = (vsNode: any, arrLiteral: ArrayLiteralExpression, codeToInsert: string, insertPos: ArrayPosition) => {
  const arrLength = arrLiteral.elements.length
  if (arrLiteral.elements.length == 0) return
  const nodeArray = arrLiteral.elements;
  let insertPosition = nodeArray[0].getStart();
  if (Number.isInteger(insertPos)) {
    const insertPosNum = parseInt('' + insertPos)
    if (insertPosNum <=0 || insertPosNum >= arrLength) {
      throw new Error(`insertIntoArray: Invalid insertPos ${insertPos} argument`)
    }
    insertPosition = nodeArray[insertPosNum].getStart();
  }

  if (insertPos === 'end') {
    const lastIndex = arrLiteral.elements.length - 1;
    insertPosition = nodeArray[lastIndex].getEnd();
  }    
  return insertCode(vsNode, insertPosition, codeToInsert);  
}

export function insertIntoNamedArray(
  tree: Tree,
  { projectRoot, relTargetFilePath, targetIdName, codeToInsert, insertPos }: InsertArrayOptions
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  const replaceVarFn = (node: any) => {
    let modifiedNode = node.getFullText();
    const vsNode = node as VariableStatement;
    const declaration = findDeclarationIdentifier(vsNode, targetIdName);
    if (!declaration) return modifiedNode
    const arrLiteral = declaration.initializer as ArrayLiteralExpression;
    const newTxt = insertIntoArray(vsNode, arrLiteral, codeToInsert, insertPos);
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
