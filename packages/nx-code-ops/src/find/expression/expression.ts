import { tsquery } from '@phenomnomnominal/tsquery';
import { BinaryExpression, Node, PrefixUnaryExpression } from 'typescript';

export const findFirstConditionalExpression = (
  node: Node,
): PrefixUnaryExpression | BinaryExpression | undefined => {
  const binExprs = findBinaryExpressions(node);
  if (!binExprs || binExprs.length === 0) {
    const prefixUnaryExprs = findPrefixUnaryExpressions(node);
    if (!prefixUnaryExprs || prefixUnaryExprs.length === 0) return;
    return prefixUnaryExprs[0];
  }
  return binExprs[0];
};

export const findBinaryExpressions = (node: any): BinaryExpression[] => {
  const selector = 'BinaryExpression';
  const matches = tsquery(node, selector);
  return matches as BinaryExpression[];
};

export const findPrefixUnaryExpressions = (
  node: any,
): PrefixUnaryExpression[] => {
  const selector = 'PrefixUnaryExpression';
  const matches = tsquery(node, selector);
  return matches as PrefixUnaryExpression[];
};
