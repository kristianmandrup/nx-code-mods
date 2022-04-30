import { Block, SourceFile } from 'typescript';

export type StmtContainerNode = SourceFile | Block;

export const getFirstStatement = (node: SourceFile | Block) =>
  node.statements[0];

export const getLastStatement = (node: StmtContainerNode) =>
  node.statements[node.statements.length - 1];
