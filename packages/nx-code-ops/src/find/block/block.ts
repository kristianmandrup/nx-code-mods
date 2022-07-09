import { tsquery } from '@phenomnomnominal/tsquery';
import { Block, Node, Statement } from 'typescript';

export const findBlock = (node: Node) => {
  const result = tsquery(node, `Block`);
  if (!result || result.length === 0) return;
  return result[0] as Block;
};

export const findBlockStatementByIndex = (
  block: Block,
  index: number,
): Statement | undefined => {
  return block.statements.find((_, idx) => idx === index) as Statement;
};
