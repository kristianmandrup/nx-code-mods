import { tsquery } from '@phenomnomnominal/tsquery';
import { Block, Identifier, IfStatement, Node } from 'typescript';
import { findDeclaredIdentifiersInScope } from '../scope';

interface IfStatementBlocks {
  thenBlock: Block;
  elseBlock: Block;
}

export const findIfThenStatementDeclaredIdentifiersInScope = (
  ifStmt: IfStatement,
): Identifier[] => {
  const block = findIfStatementThenBlock(ifStmt);
  if (!block) return [];
  return findDeclaredIdentifiersInScope(block);
};

export const findIfElseStatementDeclaredIdentifiersInScope = (
  ifStmt: IfStatement,
): Identifier[] => {
  const block = findIfStatementElseBlock(ifStmt);
  if (!block) return [];
  return findDeclaredIdentifiersInScope(block);
};

export const findIfThenStatementVariableDeclarationIds = (
  ifStmt: IfStatement,
): Identifier[] => {
  const block = findIfStatementThenBlock(ifStmt);
  if (!block) return [];
  return findDeclaredIdentifiersInScope(block);
};

export const findIfElseStatementVariableDeclarationIds = (
  ifStmt: IfStatement,
): Identifier[] => {
  const block = findIfStatementElseBlock(ifStmt);
  if (!block) return [];
  return findDeclaredIdentifiersInScope(block);
};

export const getIfStatementBlocks = (
  node: Node,
): IfStatementBlocks | undefined => {
  const result = findIfStatementsBlocks(node);
  if (!result || result.length === 0) return;
  const thenBlock = result[0];
  const elseBlock = result[1];
  return {
    thenBlock,
    elseBlock,
  };
};

export const findIfStatementThenBlock = (node: Node): Block | undefined => {
  const result = findIfStatementsBlocks(node);
  if (!result || result.length === 0) return;
  return result[0];
};

export const findIfStatementElseBlock = (node: Node): Block | undefined => {
  const result = findIfStatementsBlocks(node);
  if (!result || result.length < 2) return;
  return result[1];
};

export const findIfStatements = (node: Node): IfStatement[] | undefined => {
  const result: IfStatement[] = tsquery(node, `IfStatement`);
  if (!result || result.length === 0) return;
  return result;
};

export const findIfStatementsBlocks = (node: Node): Block[] | undefined => {
  const result: Block[] = tsquery(node, `IfStatement > Block`);
  if (!result || result.length === 0) return;
  return result;
};

export const findIfStatementsWithElseBlocks = (
  node: Node,
): IfStatement[] | undefined => {
  const result = findIfStatements(node);
  if (!result || result.length === 0) return;
  const ifStatements: IfStatement[] = result;
  return ifStatements.filter((stmt: IfStatement) => {
    return stmt.elseStatement ? true : false;
  });
};

export const findIfStatementsWithoutElseBlocks = (
  node: Node,
): IfStatement[] | undefined => {
  const result = findIfStatements(node);
  if (!result || result.length === 0) return;
  const ifStatements: IfStatement[] = result;
  return ifStatements.filter((stmt: IfStatement) => {
    return stmt.elseStatement ? false : true;
  });
};
