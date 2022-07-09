import { tsquery } from '@phenomnomnominal/tsquery';
import {
  BindingName,
  Decorator,
  FunctionDeclaration,
  FunctionLikeDeclarationBase,
  Identifier,
  MethodDeclaration,
  Node,
  NodeArray,
  ParameterDeclaration,
} from 'typescript';
import { findMatchingDecorator } from '../decorator';
import { findFirstParamPos, findLastParamPos } from './param-position';

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
  node: FunctionDeclaration,
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
  fnLikeDecl: FunctionLikeDeclarationBase,
  paramId: string,
): ParameterDeclaration | undefined => {
  const params: any = (fnLikeDecl as FunctionLikeDeclarationBase).parameters;
  if (fnLikeDecl.parameters) {
    if (params.pos) {
      return;
    }
    const found = fnLikeDecl.parameters.find(
      (param: ParameterDeclaration) =>
        (param.name as BindingName).getText() === paramId,
    );
    return found ? (found as ParameterDeclaration) : undefined;
  }
};

export const findParameterDecorators = (
  node: FunctionLikeDeclarationBase,
  paramId: string,
): NodeArray<Decorator> | undefined => {
  const param = findMatchingParameter(node, paramId);
  if (!param) return;
  return param.decorators;
};

export const findMatchingParameterDecorator = (
  node: FunctionLikeDeclarationBase,
  paramId: string,
  decoratorId: string,
): Decorator | undefined => {
  const decorators = findParameterDecorators(node, paramId);
  if (!decorators) return;
  return findMatchingDecorator(decorators, decoratorId);
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
