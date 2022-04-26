import { createUnaryExpressionParser } from './unary-expr';
import { findBinaryExpressions, findPrefixUnaryExpressions } from '../../find';
import { camelizedIdentifier, sortByPosition } from '../utils';
import { createBinaryExpressionParser } from './binary-expression';

export const conditionName = (condition: Node) => {
  const binaryExprs = findBinaryExpressions(condition);
  const binExprParsers = binaryExprs.map(createBinaryExpressionParser);

  const prefixUnaryExprs = findPrefixUnaryExpressions(condition);
  const prefixUnaryExprParsers = prefixUnaryExprs.map(
    createUnaryExpressionParser,
  );

  const allExprParsers = [...binExprParsers, ...prefixUnaryExprParsers];
  const sortedExprs = sortByPosition(allExprParsers);
  const parts = sortedExprs.map((expr) => expr.name);
  return camelizedIdentifier(parts);
};
