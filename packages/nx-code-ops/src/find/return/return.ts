import { tsquery } from '@phenomnomnominal/tsquery';
import { Identifier, Node } from 'typescript';

export const findReturnStatementIdentifiersFor = (node: Node): Identifier[] => {
  const selector = `ReturnStatement Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};
