import { tsquery } from '@phenomnomnominal/tsquery';
import { Node, StringLiteral, StringLiteralLike } from 'typescript';

export const findAllStringLiteralsFor = (node: Node): StringLiteral[] => {
  const selector = `StringLiteral`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as StringLiteral[];
};

export const findStringLiteral = (
  node: Node,
  value: string,
): StringLiteralLike | undefined => {
  if (!value) {
    throw Error('findStringLiteral: missing value');
  }
  const selector = `StringLiteral[value='${value}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as StringLiteralLike;
};
