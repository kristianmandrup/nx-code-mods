import { tsquery } from '@phenomnomnominal/tsquery';
import {
  Decorator,
  Identifier,
  MethodDeclaration,
  Node,
  ParameterDeclaration,
} from 'typescript';
import { findMatchingDecoratorForNode } from '../decorator';
import { findParameter } from '../function';
import { WhereFn } from '../types';
import { findClassDeclaration } from './class';

export const findFirstMethodDeclaration = (
  node: Node,
): MethodDeclaration | undefined => {
  const result = tsquery(node, `MethodDeclaration:first-child`);
  if (!result || result.length === 0) return;
  const found = result[0] as MethodDeclaration;
  return found;
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

export const findMethodDeclarationParameterIds = (
  node: MethodDeclaration,
): Identifier[] => {
  const selector = `MethodDeclaration > Parameter > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
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
