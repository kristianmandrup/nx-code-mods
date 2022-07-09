import { tsquery } from '@phenomnomnominal/tsquery';
import { Block, Expression } from 'typescript';
import { findBlock } from '../../find/block';

export const wrapBlock = (src: string) => {
  return '{' + src + '}';
};

export const codeToSourceFile = (code: string) => tsquery.ast(code);

export const codeToBlock = (code: string) => {
  const srcFile = codeToSourceFile(code);
  return findBlock(srcFile) as Block;
};

export const expressionToBlock = (expr: Expression) => {
  const exprCode = expr.getText();
  const code = wrapBlock(exprCode);
  return codeToBlock(code) as Block;
};
