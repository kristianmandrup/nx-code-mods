import { Identifier, Node, PropertyAccessExpression } from 'typescript';
import { unique } from '../auto-name';
import { findAllIdentifiersFor } from '../find';

export const mapIdentifiersToTxtList = (ids: Identifier[]): string[] =>
  ids.map((id) => id.escapedText as string);

export const mapIdentifiersToSrc = (ids: Identifier[]) => {
  return unique(mapIdentifiersToTxtList(ids)).join(', ');
};

export const exprToSrcIds = (expr: Node) => {
  return idsToSrc(findAllIdentifiersFor(expr));
};

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
