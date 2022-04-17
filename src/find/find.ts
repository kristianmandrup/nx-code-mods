import {
  Block,
  ClassDeclaration,
  Decorator,
  FunctionDeclaration,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  MethodDeclaration,
  Node,
  ParameterDeclaration,
  PropertyDeclaration,
  SourceFile,
  Statement,
  StringLiteralLike,
  VariableDeclaration,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

type WhereFn = (stmt: Node) => boolean;

export const getFirstStatement = (ast: SourceFile) => ast.statements[0];
export const getLastStatement = (ast: SourceFile) =>
  ast.statements[ast.statements.length - 1];

export const hasAnyImportDecl = (node: SourceFile) =>
  Boolean(findLastImport(node));

export const findMatchingImportDeclarationsByFileRef = (
  node: SourceFile,
  importFileRef: string,
): ImportDeclaration[] | undefined => {
  const selector = `ImportDeclaration > StringLiteral[value='${importFileRef}']`;
  const matches = tsquery(node, selector);
  return matches.map((m) => m.parent) as ImportDeclaration[];
};

export const findImportSpecifier = (
  node: any,
  importId: string,
): ImportSpecifier | undefined => {
  const selector = `ImportSpecifier > Identifier[name='${importId}']`;
  const ids = tsquery(node, selector);
  const matches = ids.map((m) => m.parent) as ImportSpecifier[];
  return matches[0];
};

export const findMatchingImportDecl = (
  node: any,
  { importId, importFileRef }: { importId: string; importFileRef: string },
): ImportDeclaration | undefined => {
  try {
    const matchingImportFileNodes = findMatchingImportDeclarationsByFileRef(
      node,
      importFileRef,
    );
    if (!matchingImportFileNodes || matchingImportFileNodes.length === 0) {
      // console.log('no import match');
      return;
    }
    const importIdSelector = `ImportDeclaration Identifier[name='${importId}']`;
    let found;
    matchingImportFileNodes.find((importDeclNode) => {
      const matchingId = tsquery(importDeclNode, importIdSelector);
      if (matchingId) {
        found = importDeclNode;
      }
    });
    return found;
  } catch (e) {
    console.error(e);
    return;
  }
};

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
  { classId, propertyId }: { classId: string; propertyId: string },
  where?: WhereFn,
): PropertyDeclaration | undefined => {
  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) return;
  return findPropertyDeclaration(classDecl, propertyId);
};

export const findPropertyDeclaration = (
  node: Node,
  propertyId: string,
  where?: WhereFn,
): PropertyDeclaration | undefined => {
  const result = tsquery(
    node,
    `PropertyDeclaration > Identifier[name='${propertyId}']`,
  );
  if (!result || result.length === 0) return;
  const found = result[0].parent as PropertyDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findClassMethodDeclaration = (
  node: Node,
  { classId, methodId }: { classId: string; methodId: string },
  where?: WhereFn,
): MethodDeclaration | undefined => {
  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) return;
  return findMethodDeclaration(classDecl, methodId);
};

export const findMethodDeclaration = (
  node: Node,
  methodId: string,
  where?: WhereFn,
): MethodDeclaration | undefined => {
  const result = tsquery(
    node,
    `MethodDeclaration > Identifier[name='${methodId}']`,
  );
  if (!result || result.length === 0) return;
  const found = result[0].parent as MethodDeclaration;
  if (!where) return found;
  if (where(found)) {
    return found;
  }
};

export const findClassMethodParameterDeclaration = (
  node: Node,
  opts: { classId: string; methodId: string; paramId: string },
  where?: WhereFn,
): ParameterDeclaration | undefined => {
  const { classId, methodId, paramId } = opts;
  const methDecl = findClassMethodDeclaration(node, opts);
  if (!methDecl) return;
  return findParameter(methDecl, paramId);
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

export const findDecorator = (
  node: Node,
  decoratorId: string,
): Decorator | undefined => {
  const selector = `Decorator[name='${decoratorId}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0].parent as Decorator;
};

export const findClassDecorator = (
  node: Node,
  { classId, decoratorId }: { classId: string; decoratorId: string },
): Decorator | undefined => {
  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) return;
  const dec = findDecorator(classDecl, decoratorId);
  if (!dec) {
    return;
  }
  return dec as Decorator;
};

// TODO: optimize: see findClassPropertyDeclaration
export const findClassMethodDecorator = (
  node: Node,
  {
    classId,
    methodId,
    decoratorId,
  }: { classId: string; methodId: string; decoratorId: string },
): Decorator | undefined => {
  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, decoratorId);
  if (!methodDecl) return;
  const dec = findDecorator(methodDecl, decoratorId);
  if (!dec) return;
  return dec as Decorator;
};

export const findParamWithDecorator = (
  node: Node,
  decoratorId: string,
): ParameterDeclaration | undefined => {
  const selector = `Parameter > Decorator[name='${decoratorId}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0].parent as ParameterDeclaration;
};

export const findParameter = (
  node: Node,
  paramId: string,
): ParameterDeclaration | undefined => {
  const selector = `Parameter > Identifier[name='${paramId}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0].parent as ParameterDeclaration;
};

export const findVariableDeclaration = (
  node: Node,
  varId: string,
  where?: WhereFn,
): VariableDeclaration | undefined => {
  const selector = `VariableDeclaration > Identifier[name='${varId}']`;
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
  functionId: string,
): FunctionDeclaration | undefined => {
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

export const whereHasDecorator = (node: Node, id?: string) => {
  let query = 'Decorator ';
  if (id) {
    query = query.concat("> CallExpression > Identifier[name='${id}']'");
  }
  const found = tsquery(node, query);
  if (!found) return false;
  return Boolean(found[0].parent);
};

export const findFunction = (
  node: Node,
  functionId: string,
): VariableDeclaration | FunctionDeclaration | undefined => {
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
