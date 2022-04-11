import {
  Block,
  ClassDeclaration,
  FunctionDeclaration,
  Identifier,
  ImportDeclaration,
  MethodDeclaration,
  Node,
  PropertyDeclaration,
  SortedArray,
  SourceFile,
  Statement,
  StringLiteral,
  StringLiteralLike,
  VariableDeclaration,
  VariableStatement,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

type WhereFn = (stmt: Node) => boolean;

export const getFirstStatement = (ast: SourceFile) => ast.statements[0];
export const getLastStatement = (ast: SourceFile) =>
  ast.statements[ast.statements.length - 1];

export const findLastImport = (
  srcNode: SourceFile,
): ImportDeclaration | undefined => {
  try {
    const result = tsquery(srcNode, 'ImportDeclaration:last-child');
    if (!result || result.length === 0) return;
    return result[0] as ImportDeclaration;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const findClassDeclaration = (
  vsNode: Node,
  targetIdName: string,
  where?: WhereFn,
): ClassDeclaration | undefined => {
  const result = tsquery(
    vsNode,
    `ClassDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result || result.length === 0) return;
  const found = result[0].parent as ClassDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findMethodDeclaration = (
  node: Node,
  targetIdName: string,
  where?: WhereFn,
): MethodDeclaration | undefined => {
  const result = tsquery(
    node,
    `MethodDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result || result.length === 0) return;
  const found = result[0].parent as MethodDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findFirstMethodDeclaration = (
  node: Node,
): MethodDeclaration | undefined => {
  const result = tsquery(node, `MethodDeclaration:first-child`);
  if (!result || result.length === 0) return;
  const found = result[0] as MethodDeclaration;
  return found;
};

export const findFirstPropertyDeclaration = (
  node: Node,
): PropertyDeclaration | undefined => {
  const result = tsquery(node, `PropertyDeclaration:first-child`);
  if (!result || result.length === 0) return;
  const found = result[0] as PropertyDeclaration;
  return found;
};

export const findLastPropertyDeclaration = (
  node: Node,
): PropertyDeclaration | undefined => {
  const result = tsquery(node, `PropertyDeclaration:first-child`);
  if (!result || result.length === 0) return;
  const found = result[0] as PropertyDeclaration;
  return found;
};

export const findClassPropertyDeclaration = (
  node: Node,
  targetIdName: string,
  where?: WhereFn,
): PropertyDeclaration | undefined => {
  const result = tsquery(
    node,
    `ClassDeclaration > PropertyDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result || result.length === 0) return;
  const found = result[0].parent as PropertyDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findStringLiteral = (
  node: Node,
  id: string,
): StringLiteralLike | undefined => {
  const selector = `StringLiteral[value='${id}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as StringLiteralLike;
};

export const findIdentifier = (
  node: Node,
  id: string,
): Identifier | undefined => {
  const selector = `Identifier[name='${id}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as Identifier;
};

export const findVariableDeclaration = (
  node: Node,
  id: string,
  where?: WhereFn,
): VariableDeclaration | undefined => {
  const selector = `VariableDeclaration > Identifier[name='${id}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  const found = (result[0] as Identifier).parent as VariableDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findFunctionDeclaration = (
  node: Node,
  targetIdName: string,
): FunctionDeclaration | undefined => {
  const result = tsquery(
    node,
    `FunctionDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result || result.length === 0) return;
  return result[0].parent as FunctionDeclaration;
};

export const whereHasArrowFunction = (node: Node) => {
  const found = tsquery(node, 'ArrowFunction');
  if (!found) return false;
  return Boolean(found[0]);
};

export const whereHasDecorator = (node: Node, id?: string) => {
  let query = 'Decorator ';
  if (id) {
    query = query.concat("> CallExpression > Identifier[name='${id}']'");
  }
  const found = tsquery(node, query);
  if (!found) return false;
  return Boolean(found[0].parent);
};

type FindFunReturn = {
  node: Node;
  declaration: boolean;
  arrow: boolean;
};

export const findFunction = (
  node: Node,
  targetIdName: string,
): FindFunReturn | undefined => {
  const declFun = findVariableDeclaration(
    node,
    targetIdName,
    whereHasArrowFunction,
  );
  if (declFun)
    return {
      node: declFun,
      declaration: true,
      arrow: false,
    };

  const fun = findFunctionDeclaration(node, targetIdName);
  if (fun)
    return {
      node: fun,
      declaration: false,
      arrow: true,
    };
};

export const findFunctionBlock = (
  node: Node,
  targetIdName: string,
): Block | undefined => {
  const fun = findFunction(node, targetIdName);
  if (!fun) return;
  let result;
  if (fun.arrow) {
    result = tsquery(fun.node, `ArrowFunction > Block`);
    if (!result) return;
    return result[0] as Block;
  }
  if (fun.declaration) {
    return findBlock(fun.node);
  }
};

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
