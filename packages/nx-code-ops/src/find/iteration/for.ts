import { tsquery } from '@phenomnomnominal/tsquery';
import { ForStatement, Identifier, VariableDeclarationList } from 'typescript';
import { findVariableDeclarationListIds } from '../variable';

export const findForStatementVariableDeclarationIds = (
  node: ForStatement,
): Identifier[] => {
  const selector = `ForStatement > VariableDeclarationList`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  const declList = result[0] as VariableDeclarationList;
  return findVariableDeclarationListIds(declList);
};
