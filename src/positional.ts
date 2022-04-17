import { Node } from 'typescript';
import { BetweenPos } from './types';

export const swapPositions = ({ startPos, endPos }: BetweenPos) => {
  return { startPos: endPos, endPos: startPos };
};

export const endOfIndex = (node: Node) => {
  return node.getEnd() - 1;
};

export const startOfIndex = (node: Node) => {
  return node.getStart() + 1;
};

export const beforeIndex = (node: Node) => {
  return node.getStart() - 1;
};

export const afterIndex = (node: Node) => {
  return node.getEnd() + 1;
};
