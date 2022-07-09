import { tsquery } from '@phenomnomnominal/tsquery';
import { Node, PropertyDeclaration } from 'typescript';
import { WhereFn } from '../types';
import { findClassDeclaration } from './class';

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
