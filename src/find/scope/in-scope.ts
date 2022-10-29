import { unique } from './../../auto-name';
import {
  Block,
  ForStatement,
  FunctionDeclaration,
  Identifier,
  MethodDeclaration,
  Node,
  SourceFile,
  SyntaxKind,
} from 'typescript';
import {
  findFunctionDeclarationParameterIds,
  findFunctionDeclIdentifiers,
} from '../function';
import {
  findClassDeclIdentifiers,
  findMethodDeclarationParameterIds,
} from '../class';
import { findForStatementVariableDeclarationIds } from '../iteration';
import { findVarDeclIdentifiers } from '../variable';
import { findImportIdentifiers } from '../import';

export const isFunctionDeclaration = (node: Node) =>
  node.kind === SyntaxKind.FunctionDeclaration;

export const isMethodDeclaration = (node: Node) =>
  node.kind === SyntaxKind.MethodDeclaration;

export const isFunction = (node: Node) =>
  isFunctionDeclaration(node) || isArrowFunction(node);

export const isArrowFunction = (node: Node) =>
  node.kind === SyntaxKind.ArrowFunction;

export const isForStatement = (node: Node) =>
  isForInStatement(node) || isForOfStatement(node);

export const isWhileStatement = (node: Node) =>
  node.kind === SyntaxKind.WhileStatement;
export const isForOfStatement = (node: Node) =>
  node.kind === SyntaxKind.ForOfStatement;
export const isForInStatement = (node: Node) =>
  node.kind === SyntaxKind.ForInStatement;
export const isIfStatement = (node: Node) =>
  node.kind === SyntaxKind.IfStatement;

export const isScopeBlock = (node: Node) => {
  const parent = node.parent;
  return (
    isWhileStatement(parent) ||
    isForStatement(parent) ||
    isIfStatement(parent) ||
    isFunction(parent) ||
    isMethodDeclaration(parent)
  );
};

export const findFunctionDeclParamIds = (node: Node): Identifier[] => {
  if (!isFunctionDeclaration(node)) return [];
  return findFunctionDeclarationParameterIds(node as FunctionDeclaration);
};

export const findMethodDeclParamIds = (node: Node): Identifier[] => {
  if (!isMethodDeclaration(node)) return [];
  return findMethodDeclarationParameterIds(node as MethodDeclaration);
};

export const findForStmtDeclIds = (node: Node): Identifier[] => {
  if (!isForStatement(node)) return [];
  return findForStatementVariableDeclarationIds(node as ForStatement);
};

export const findIfStmtDeclIds = (node: Node, block?: Node): Identifier[] => {
  if (!isIfStatement(node) || !block) return [];
  return findDeclaredIdentifiersInScope(block);
};

export const findLocalIdentifiersWithinScopePath = (
  node: Node,
): Identifier[] => {
  const found: Identifier[] = [];

  const addIds = (ids: Identifier[]) => {
    found.push(...ids);
  };

  let recentBlock: Block | undefined;
  while ((node = node.parent)) {
    if (node.kind === SyntaxKind.Block) {
      recentBlock = node as Block;
    }
    if (isScopeBlock(node)) {
      // add special ids
      addIds(findForStmtDeclIds(node));
      addIds(findIfStmtDeclIds(node, recentBlock));
      addIds(findFunctionDeclParamIds(node));
      addIds(findMethodDeclParamIds(node));
      // add block ids
      addIds(findDeclaredIdentifiersInScope(node));
    }
  }

  return unique(found);
};

export const findDeclaredIdentifiersInScope = (node: Node) => {
  const varIds = findVarDeclIdentifiers(node);
  const funIds = findFunctionDeclIdentifiers(node);
  const classIds = findClassDeclIdentifiers(node);
  return [...varIds, ...funIds, ...classIds] as Identifier[];
};

export const findTopLevelIdentifiers = (srcNode: SourceFile) => {
  const importIds = findImportIdentifiers(srcNode);
  const scopeIds = findDeclaredIdentifiersInScope(srcNode);
  return [...importIds, ...scopeIds] as Identifier[];
};
