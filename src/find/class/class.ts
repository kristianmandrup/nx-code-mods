import { tsquery } from '@phenomnomnominal/tsquery';
import { ClassDeclaration, Decorator, Identifier, Node } from 'typescript';
import { WhereFn } from '../types';
import { findMatchingDecoratorForNode } from '../decorator';

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

export const findClassDeclIdentifiers = (node: Node): Identifier[] => {
  const selector = `ClassDeclaration > Identifier`;
  const result = tsquery(node, selector);
  if (!result || result.length === 0) {
    return [];
  }
  return result as Identifier[];
};
