import { createUnaryExpressionParser } from './unary-expr';
import { findBinaryExpressions, findPrefixUnaryExpressions } from '../../find';
import { camelizedIdentifier, sortByPosition, unique } from '../utils';
import { createBinaryExpressionParser } from './binary-expression';
import { Node } from 'typescript';

export const conditionParts = (condition: Node, fn = 'partition') => {
  const binaryExprs = findBinaryExpressions(condition);
  const binExprParsers = binaryExprs.map(createBinaryExpressionParser);

  const prefixUnaryExprs = findPrefixUnaryExpressions(condition);
  const prefixUnaryExprParsers = prefixUnaryExprs.map(
    createUnaryExpressionParser,
  );
  const allExprParsers = [...binExprParsers, ...prefixUnaryExprParsers];
  const sortedExprs = sortByPosition(allExprParsers);
  const parts = sortedExprs.map((expr) => expr[fn]()).flat();
  return unique(parts);
};

export const conditionName = (condition: Node) => {
  const filteredParts = conditionParts(condition, 'name');
  return camelizedIdentifier(filteredParts);
};
