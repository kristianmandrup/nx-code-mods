import { tsquery } from '@phenomnomnominal/tsquery';
import {
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  SourceFile,
} from 'typescript';

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

export const findImportIdentifiers = (node: any): Identifier[] => {
  const selector = `ImportSpecifier > Identifier`;
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
