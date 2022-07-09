import { tsquery } from '@phenomnomnominal/tsquery';
import { Block, Expression } from 'typescript';
import { findBlock } from '../../find/block';

export const wrapBlock = (src: string) => {
  return '{' + src + '}';
};

export const expressionToBlock = (expr: Expression) => {
  const exprCode = expr.getText();
  const blockCode = wrapBlock(exprCode);
  return findBlock(tsquery.ast(blockCode)) as Block;
};
