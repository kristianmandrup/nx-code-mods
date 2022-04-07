import {
  Identifier,
  TypeReferenceNode,
  VariableDeclaration,
  VariableStatement,
} from 'typescript';
import * as path from 'path';

export const findDeclarationIdentifier = (vsNode: VariableStatement, targetIdName: string): VariableDeclaration | undefined => {
    vsNode.declarationList.declarations.forEach((declaration) => {
      const typeNode = declaration.type as TypeReferenceNode;
      const identifier = typeNode.typeName as Identifier;
      if (identifier.escapedText === targetIdName) {
        return declaration
      }
    })
    return;
  }
