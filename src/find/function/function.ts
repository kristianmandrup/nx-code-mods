import { tsquery } from '@phenomnomnominal/tsquery';
import {
  Block,
  FunctionDeclaration,
  Identifier,
  Node,
  VariableDeclaration,
} from 'typescript';
import { findBlock } from '../block';
import { findVariableDeclaration } from '../variable';

export const findFunctionDeclIdentifiers = (node: Node) => {
  const selector = `> FunctionDeclaration > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};

export const findFunctionDeclaration = (
  node: Node,
  functionId: string,
): FunctionDeclaration | undefined => {
  if (!functionId) {
    throw Error('findFunctionDeclaration: missing functionId');
  }
  const result = tsquery(
    node,
    `FunctionDeclaration > Identifier[name='${functionId}']`,
  );
  if (!result || result.length === 0) return;
  return result[0].parent as FunctionDeclaration;
};

export const whereHasArrowFunction = (node: Node) => {
  const found = tsquery(node, 'ArrowFunction');
  if (!found) return false;
  return Boolean(found[0]);
};

export type FunctionLikeDecl = VariableDeclaration | FunctionDeclaration;

export const findFunction = (
  node: Node,
  functionId: string,
): FunctionLikeDecl | undefined => {
  const declFun = findVariableDeclaration(
    node,
    functionId,
    whereHasArrowFunction,
  );
  if (declFun) return declFun;

  const fun = findFunctionDeclaration(node, functionId);
  if (fun) return fun;
};

export const findFunctionBlock = (
  node: Node,
  functionId: string,
): Block | undefined => {
  const fun = findFunction(node, functionId);
  if (!fun) return;
  return findBlock(fun);
};
