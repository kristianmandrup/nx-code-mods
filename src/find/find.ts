import { sortByPosition } from './../auto-name/utils';
import {
  BinaryExpression,
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
  PrefixUnaryExpression,
  PropertyDeclaration,
  SourceFile,
  Statement,
  StringLiteral,
  StringLiteralLike,
  SyntaxKind,
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';
import { endOfIndex, startOfIndex } from '../positional';
import { escapeRegExp } from '../utils';

export type WhereFn = (stmt: Node) => boolean;

export type StmtContainerNode = SourceFile | Block;

export const getFirstStatement = (node: SourceFile | Block) =>
  node.statements[0];

export const getLastStatement = (node: StmtContainerNode) =>
  node.statements[node.statements.length - 1];

export const hasAnyImportDecl = (node: SourceFile) =>
  Boolean(findLastImport(node));

export const findBinaryExpressions = (node: any): BinaryExpression[] => {
  const selector = 'BinaryExpression';
  const matches = tsquery(node, selector);
  return matches as BinaryExpression[];
};

export const findPrefixUnaryExpressions = (
  node: any,
): PrefixUnaryExpression[] => {
  const selector = 'PrefixUnaryExpression';
  const matches = tsquery(node, selector);
  return matches as PrefixUnaryExpression[];
};

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

export const findImportIdentifiers = (node: any): Identifier[] => {
  const selector = `ImportSpecifier > Identifier']`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) return [];
  return result as Identifier[];
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

export const findFirstConditionalExpression = (
  node: Node,
): PrefixUnaryExpression | BinaryExpression | undefined => {
  const binExprs = findBinaryExpressions(node);
  if (!binExprs || binExprs.length === 0) {
    const prefixUnaryExprs = findPrefixUnaryExpressions(node);
    if (!prefixUnaryExprs || prefixUnaryExprs.length === 0) return;
    return prefixUnaryExprs[0];
  }
  return binExprs[0];
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

export type IdLike = Identifier | StringLiteral;

export const findAllIdentifiersOrStringLiteralsFor = (node: Node): IdLike[] => {
  const ids = findAllIdentifiersFor(node);
  const strLits = findAllStringLiteralsFor(node);
  const allIds = [...ids, ...strLits];
  const sortedIds = sortByPosition(allIds);
  return sortedIds;
};

export const findAllIdentifiersFor = (node: Node): Identifier[] => {
  const selector = `Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};

export const findAllStringLiteralsFor = (node: Node): StringLiteral[] => {
  const selector = `StringLiteral`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as StringLiteral[];
};

export const findReturnStatementIdentifiersFor = (node: Node): Identifier[] => {
  const selector = `ReturnStatement Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};

interface IfStatementBlocks {
  thenBlock: Block;
  elseBlock: Block;
}

function isSourceFile(object: any): object is SourceFile {
  return 'fooProperty' in object;
}

export const getSourceFile = (node: Node): SourceFile => {
  return node.getSourceFile();
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

export const findFirstIdentifier = (node: Node): Identifier | undefined => {
  const selector = `Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as Identifier;
};

export const findLastIdentifier = (node: Node): Identifier | undefined => {
  const selector = `Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[result.length - 1] as Identifier;
};

export const isScopeBlock = (node: Node) => {
  const parent = node.parent;
  if (parent.kind === SyntaxKind.WhileStatement) return true;
  if (parent.kind === SyntaxKind.ForOfStatement) return true;
  if (parent.kind === SyntaxKind.ForInStatement) return true;
  if (parent.kind === SyntaxKind.IfStatement) return true;
  if (parent.kind === SyntaxKind.ArrowFunction) return true;
  if (parent.kind === SyntaxKind.FunctionDeclaration) return true;
  if (parent.kind === SyntaxKind.MethodDeclaration) return true;
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

export const getVariableStatementIdentifiers = (
  varStmts: VariableStatement[],
) => {
  const varIds: Identifier[] = [];
  varStmts.map((varStmt: VariableStatement) => {
    varStmt.declarationList.declarations.map((decl: VariableDeclaration) => {
      const varId = findVariableIdentifier(decl);
      if (varId) {
        varIds.push(varId);
      }
    });
  });
  return varIds;
};

export const findVarDeclIdentifiers = (node: Node): Identifier[] => {
  const selector = `> VariableStatement`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  const varStmts = result as VariableStatement[];
  return getVariableStatementIdentifiers(varStmts);
};

export const findFunctionDeclIdentifiers = (node: Node) => {
  const selector = `> FunctionDeclaration > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};

export const findClassDeclIdentifiers = (node: Node): Identifier[] => {
  const selector = `> ClassDeclaration > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
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

export const findForStatementVariableDeclarationIds = (
  node: Node,
): Identifier[] => {
  const selector = `ForStatement > VariableDeclarationList`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  const declList = result[0] as VariableDeclarationList;
  const ids = tsquery(
    node,
    'VariableDeclarationList > VariableDeclaration > Identifier',
  );
  if (!ids || ids.length === 0) {
    return [];
  }
  return ids as Identifier[];
};

export const findMethodDeclarationParameterIds = (node: Node): Identifier[] => {
  const selector = `MethodDeclaration > Parameter > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};

export const findFunctionCallParameterIds = (node: Node): Identifier[] => {
  const selector = `CallExpression > Parameter > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};

export const findArrowFunctionParameterIds = (node: Node): Identifier[] => {
  const selector = `ArrowFunction > Parameter > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};

export const findFunctionDeclarationParameterIds = (
  node: Node,
): Identifier[] => {
  const selector = `FunctionDeclaration > Parameter > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
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

export const findVariableIdentifier = (node: Node): Identifier | undefined => {
  const selector = `VariableDeclaration > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return;
  }
  return result[0] as Identifier;
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
