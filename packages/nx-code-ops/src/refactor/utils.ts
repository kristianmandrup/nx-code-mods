import {
  Identifier,
  Node,
  PropertyAccessExpression,
  SourceFile,
} from 'typescript';
import { unique } from '../auto-name';
import {
  idToStr,
  findTopLevelIdentifiers,
  findAllIdentifiersFor,
  getSourceFile,
  findReferenceIdentifiersFor,
} from '../find';

export const mapIdentifiersToTxtList = (ids: Identifier[]): string[] =>
  ids.map((id) => id.escapedText as string);

export const mapIdentifiersToSrc = (ids: Identifier[]) => {
  return unique(mapIdentifiersToTxtList(ids)).join(', ');
};

export const filterLocalIdentifiers = (
  node: Node,
  ids: Identifier[],
): Identifier[] => {
  const sourceFile = getSourceFile(node);
  const topIds = findTopLevelIds(sourceFile);
  return ids.filter((id: Identifier) => !topIds.includes(idToStr(id)));
};

export const findTopLevelIds = (sourceFile: SourceFile) => {
  const ids = findTopLevelIdentifiers(sourceFile);
  return ids.map(idToStr);
};

export type IdsFinder = (node: Node) => string[];

export const srcIdsFor = (node: Node, find: IdsFinder) => {
  find = find || findAllLocalIds;
  return idsToSrc(findAllIdentifiersFor(node));
};

export const findAllLocalIds = (node: Node): Identifier[] => {
  const ids = findAllIdentifiersFor(node);
  return filterLocalIdentifiers(node, ids);
};

export const findAllLocalRefIds = (node: Node): Identifier[] => {
  const ids = findReferenceIdentifiersFor(node);
  return filterLocalIdentifiers(node, ids);
};

// findLocalIdentifiersWithinScopePath

export const idsToSrc = (ids: Identifier[]) => {
  const filteredIds = filterChildIds(ids);
  return mapIdentifiersToSrc(filteredIds);
};

const filterChildIds = (ids: Identifier[]) => {
  return ids.filter((id) => {
    const idStr = id.escapedText as string;
    const parentId = id.parent;
    const propAccess = parentId as PropertyAccessExpression;
    const propAccessCode = propAccess.getFullText();
    const dotParts = propAccessCode.split('.');
    const lastDotPart = dotParts[dotParts.length - 1];
    if (lastDotPart === idStr) return false;
    return true;
  });
};
