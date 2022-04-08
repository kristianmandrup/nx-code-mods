import {
  Block,
  ClassDeclaration,
  FunctionDeclaration,
  ImportDeclaration,
  MethodDeclaration,
  Node,
  PropertyDeclaration,
  SourceFile,
  Statement,
  VariableDeclaration,
  VariableStatement,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

type WhereFn = (stmt: Node) => boolean;

export const getFirstStatement = (ast: SourceFile) => ast.statements[0];
export const getLastStatement = (ast: SourceFile) =>
  ast.statements[ast.statements.length - 1];

export const findLastImport = (txtNode: any): ImportDeclaration | undefined => {
  try {
    const lastImport = tsquery(txtNode, 'ImportDeclaration:last-child');
    if (!lastImport) return;
    return lastImport[0] as ImportDeclaration;
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
  if (!result) return;
  const found = result[0].parent as ClassDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findMethodDeclaration = (
  vsNode: Node,
  targetIdName: string,
  where?: WhereFn,
): MethodDeclaration | undefined => {
  const result = tsquery(
    vsNode,
    `MethodDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result) return;
  const found = result[0].parent as MethodDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findFirstMethodDeclaration = (
  vsNode: Node,
): MethodDeclaration | undefined => {
  const result = tsquery(vsNode, `MethodDeclaration:first-child']`);
  if (!result) return;
  const found = result[0].parent as MethodDeclaration;
  return found;
};

export const findClassPropertyDeclaration = (
  vsNode: Node,
  targetIdName: string,
  where?: WhereFn,
): PropertyDeclaration | undefined => {
  const result = tsquery(
    vsNode,
    `ClassDeclaration > PropertyDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result) return;
  const found = result[0].parent as PropertyDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findDeclarationIdentifier = (
  vsNode: VariableStatement,
  targetIdName: string,
  where?: WhereFn,
): VariableDeclaration | undefined => {
  const result = tsquery(
    vsNode,
    `VariableDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result) return;
  const found = result[0].parent as VariableDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findFunctionDeclaration = (
  vsNode: Statement,
  targetIdName: string,
): FunctionDeclaration | undefined => {
  const result = tsquery(
    vsNode,
    `FunctionDeclaration > Identifier[name='${targetIdName}']`,
  );
  if (!result) return;
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
  vsNode: Node,
  targetIdName: string,
): FindFunReturn | undefined => {
  const declFun = findDeclarationIdentifier(
    vsNode as VariableStatement,
    targetIdName,
    whereHasArrowFunction,
  );
  if (declFun)
    return {
      node: declFun,
      declaration: true,
      arrow: false,
    };

  const fun = findFunctionDeclaration(vsNode as Statement, targetIdName);
  if (fun)
    return {
      node: fun,
      declaration: false,
      arrow: true,
    };
};

export const findFunctionBlock = (
  vsNode: Node,
  targetIdName: string,
): Block | undefined => {
  const fun = findFunction(vsNode, targetIdName);
  if (!fun) return;
  let result;
  if (fun.arrow) {
    result = tsquery(fun.node, `ArrowFunction > Block`);
    if (!result) return;
    return result[0].parent as Block;
  }
  if (fun?.declaration) {
    return findBlock(fun.node);
  }
};

export const findBlock = (vsNode: Node) => {
  const result = tsquery(vsNode, `Block`);
  if (!result) return;
  return result[0].parent as Block;
};

export const findBlockStatementByIndex = (
  block: Block,
  index: number,
): Statement | undefined => {
  return block.statements.find((_, idx) => idx === index) as Statement;
};
