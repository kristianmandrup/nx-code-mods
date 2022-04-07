import { Tree } from '@nrwl/devkit';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ArrayLiteralExpression,
  Identifier,
  TypeReferenceNode,
  VariableStatement,
} from 'typescript';
import * as path from 'path';

export interface NormalizedSchema {
    projectRoot: string;

}

export interface PrependArrayOptions { 
    projectRoot: string
    relTargetFilePath: string
    targetIdName: string
    toInsert: string
}

export function prependArray(
  tree: Tree,
  { projectRoot, relTargetFilePath, targetIdName, toInsert }: PrependArrayOptions
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);
  
  const replaceVarFn = (node: any) => {
    let modifiedNode = node.getFullText();
    const vsNode = node as VariableStatement;
    vsNode.declarationList.declarations.forEach((declaration) => {
      const typeNode = declaration.type as TypeReferenceNode;
      const identifier = typeNode.typeName as Identifier;
      if (identifier.escapedText === targetIdName) {
        const arrLiteral = declaration.initializer as ArrayLiteralExpression;

        // if array
        if (arrLiteral.elements.length > 0) {
          const nodeArray = arrLiteral.elements;

          const insertPosition = nodeArray[0].getStart();

          const previousTxt = vsNode.getFullText();
          const prefix = previousTxt.substring(0, insertPosition);
          const suffix = previousTxt.substring(insertPosition);
          const newTxt = `${prefix}${toInsert}${suffix}`;

          modifiedNode = newTxt;
        }
      }
    });

    return modifiedNode;
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
