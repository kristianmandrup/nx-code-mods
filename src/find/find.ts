import {
  BindingName,
  Block,
  ClassDeclaration,
  Decorator,
  FunctionDeclaration,
  Identifier,
  IfStatement,
  ImportDeclaration,
  ImportSpecifier,
  MethodDeclaration,
  Node,
  NodeArray,
  ParameterDeclaration,
  PropertyDeclaration,
  SourceFile,
  Statement,
  StringLiteralLike,
  VariableDeclaration,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { endOfIndex, startOfIndex } from '../positional';
import { escapeRegExp } from '../utils';

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
  if (!importFileRef) {
    throw Error(
      'findMatchingImportDeclarationsByFileRef: missing importFileRef',
    );
  }
  const selector = `ImportDeclaration > StringLiteral[value='${importFileRef}']`;
  const matches = tsquery(node, selector);
  return matches.map((m) => m.parent) as ImportDeclaration[];
};

export const findImportSpecifier = (
  node: any,
  importId: string,
): ImportSpecifier | undefined => {
  if (!importId) {
    throw Error('findImportSpecifier: missing importId');
  }
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
    if (!importFileRef) {
      throw Error('findMatchingImportDecl: missing importFileRef');
    }
    const matchingImportFileNodes = findMatchingImportDeclarationsByFileRef(
      node,
      importFileRef,
    );
    if (!matchingImportFileNodes || matchingImportFileNodes.length === 0) {
      return;
    }
    if (!importId) {
      return matchingImportFileNodes[0];
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
  classId: string,
  where?: WhereFn,
): ClassDeclaration | undefined => {
  if (!classId) {
    throw Error('findClassDeclaration: missing classId');
  }
  const result = tsquery(
    vsNode,
    `ClassDeclaration > Identifier[name='${classId}']`,
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

export const findIfStatementsTrueBlock = (node: Node): Block | undefined => {
  const result = findIfStatementsBlocks(node);
  if (!result || result.length === 0) return;
  return result[0];
};

export const findIfStatementsElseBlock = (node: Node): Block | undefined => {
  const result = findIfStatementsBlocks(node);
  if (!result || result.length < 2) return;
  return result[1];
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
  if (!propertyId) {
    throw Error('findPropertyDeclaration: missing propertyId');
  }
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
  if (!classId) {
    throw Error('findClassMethodDeclaration: missing decoratorId');
  }
  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) return;
  return findMethodDeclaration(classDecl, methodId);
};

export const findMethodDeclaration = (
  node: Node,
  methodId: string,
  where?: WhereFn,
): MethodDeclaration | undefined => {
  if (!methodId) {
    throw Error('findMethodDeclaration: missing decoratorId');
  }
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

export const findIdentifier = (
  node: Node,
  id: string,
): Identifier | undefined => {
  if (!id) {
    throw Error('findIdentifier: missing id');
  }
  const selector = `Identifier[name='${id}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as Identifier;
};

export const findClassDecorator = (
  node: Node,
  { classId, decoratorId }: { classId: string; decoratorId: string },
): Decorator | undefined => {
  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) return;
  const dec = findMatchingDecoratorForNode(classDecl, decoratorId);
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
  const methodDecl = findClassMethodDeclaration(node, { classId, methodId });
  if (!methodDecl) return;
  const dec = findMatchingDecoratorForNode(methodDecl, decoratorId);
  if (!dec) return;
  return dec as Decorator;
};

export const findParamWithDecorator = (
  node: Node,
  decoratorId: string,
): ParameterDeclaration | undefined => {
  if (!decoratorId) {
    throw Error('findParamWithDecorator: missing decoratorId');
  }
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
  if (!paramId) {
    throw Error('findParameter: missing paramId');
  }
  const selector = `Parameter > Identifier[name='${paramId}']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0].parent as ParameterDeclaration;
};

export const findParameterBounds = (node: any) => {
  const findStartNode = findFirstParameter;
  const findEndNode = findLastParameter;
  const params = {
    startNode: findStartNode && findStartNode(node),
    endNode: findEndNode && findEndNode(node),
  };
  return {
    startPos: findFirstParamPos(params.startNode),
    endPos: findLastParamPos(params.endNode),
  };
};

export type ParamsPos = {
  pos: number;
  end: number;
};

export const findMatchingParameter = (
  node: Node,
  paramId: string,
): ParameterDeclaration | undefined => {
  const methDec = node as MethodDeclaration;
  const params: any = methDec.parameters;
  if (methDec.parameters) {
    if (params.pos) {
      return;
    }
    const found = methDec.parameters.find(
      (param: ParameterDeclaration) =>
        (param.name as BindingName).getText() === paramId,
    );
    return found ? (found as ParameterDeclaration) : undefined;
  }
};

export const findParameterDecorators = (
  node: Node,
  paramId: string,
): NodeArray<Decorator> | undefined => {
  const param = findMatchingParameter(node, paramId);
  if (!param) return;
  return param.decorators;
};

export const findMatchingDecoratorForNode = (
  node: Node,
  decoratorId: string,
): Decorator | undefined => {
  const decorators = node.decorators;
  if (!decorators) return;
  return findMatchingDecorator(decorators, decoratorId);
};

export const findMatchingDecorator = (
  decorators: NodeArray<Decorator>,
  decoratorId: string,
): Decorator | undefined => {
  let decorator;
  decorators.find((dec: Decorator) => {
    const decTxt = dec.getText();
    const decoratorRegExp = '^' + escapeRegExp(`@${decoratorId}`);
    if (decTxt.match(decoratorRegExp)) {
      decorator = dec;
    }
  });
  return decorator ? (decorator as Decorator) : undefined;
};

export const findMatchingParameterDecorator = (
  node: Node,
  paramId: string,
  decoratorId: string,
): Decorator | undefined => {
  const decorators = findParameterDecorators(node, paramId);
  if (!decorators) return;
  let decorator;
};

export const findFirstParameter = (
  node: Node,
): ParameterDeclaration | ParamsPos | undefined => {
  const methDec = node as MethodDeclaration;
  const params: any = methDec.parameters;
  if (methDec.parameters) {
    if (params.pos) {
      return {
        pos: params.pos,
        end: params.end,
      };
    }
    return methDec.parameters[0];
  }
  const selector = `Parameter:first-child`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) return;
  const found = result[0] as ParameterDeclaration;
  return found;
};

export const findLastParameter = (
  node: Node,
): ParameterDeclaration | ParamsPos | undefined => {
  const methDec = node as MethodDeclaration;
  const params: any = methDec.parameters;
  if (methDec.parameters) {
    if (params.pos) {
      return {
        pos: params.pos,
        end: params.end,
      };
    }
    return params[params.length - 1];
  }
  const selector = `Parameter:last-child`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) return;
  const found = result[0] as ParameterDeclaration;
  return found;
};

export const findFirstParamPos = (
  param: ParameterDeclaration | ParamsPos | undefined,
) => {
  if (!param) return;
  const paramsPos = param as ParamsPos;
  if (paramsPos.pos) {
    return paramsPos.pos;
  }
  return startOfIndex(param as ParameterDeclaration);
};

export const findLastParamPos = (
  param: ParameterDeclaration | ParamsPos | undefined,
) => {
  if (!param) return;
  const paramsPos = param as ParamsPos;
  if (paramsPos.pos) {
    return paramsPos.end;
  }
  return endOfIndex(param as ParameterDeclaration);
};

export const findVariableDeclaration = (
  node: Node,
  varId: string,
  where?: WhereFn,
): VariableDeclaration | undefined => {
  if (!varId) {
    throw Error('findVariableDeclaration: missing varId');
  }
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
