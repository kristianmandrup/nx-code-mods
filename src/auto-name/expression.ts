import { Expression } from 'typescript';
import { expressionToBlock } from '../refactor';
import { blockName } from './block';

export const expressionName = (expr: Expression) => {
  const block = expressionToBlock(expr);
  return blockName(block);
};
