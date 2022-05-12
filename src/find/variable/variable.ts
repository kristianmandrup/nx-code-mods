import {
  Identifier,
  Node,
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { WhereFn } from '../types';

export const getVariableStatementIdentifiers = (
  varStmts: VariableStatement[],
) => {
  const varIds: Identifier[] = [];
  varStmts.map((varStmt: VariableStatement) => {
    varStmt.declarationList.declarations.map((decl: VariableDeclaration) => {
      const varId = findVariableIdentifier(decl);
      if (varId) {
        varIds.push(varId);
      }
    });
  });
  return varIds;
};

export const findVarDeclIdentifiers = (node: Node): Identifier[] => {
  const selector = `SourceFile > VariableStatement`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  const varStmts = result as VariableStatement[];
  return getVariableStatementIdentifiers(varStmts);
};

export const findVariableDeclarationListIds = (
  declList: VariableDeclarationList,
): Identifier[] => {
  const ids = tsquery(
    declList,
    'VariableDeclarationList > VariableDeclaration > Identifier',
  );
  if (!ids || ids.length === 0) {
    return [];
  }
  return ids as Identifier[];
};

export const findVariableIdentifier = (node: Node): Identifier | undefined => {
  const selector = `VariableDeclaration > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as Identifier;
};

export const findVariableDeclaration = (
  node: Node,
  varId: string,
  where?: WhereFn,
): VariableDeclaration | undefined => {
  if (!varId) {
    throw Error('findVariableDeclaration: missing varId');
  }
  const selector = `VariableDeclaration > Identifier[name='${varId}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  const found = (result[0] as Identifier).parent as VariableDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};
