import { swapPositions } from './positional';
import { PositionBounds } from './types';

export const createEnsureValidPosition =
  (bounds: PositionBounds) => (index: number) => {
    if (index > bounds.endPos) {
      return bounds.endPos;
    }
    if (index < bounds.startPos) {
      return bounds.startPos;
    }
    return index;
  };

export const createEnsureValidPositions =
  (bounds: PositionBounds) => (positions: PositionBounds) => {
    if (positions.startPos > positions.endPos) {
      positions = swapPositions(positions);
    }

    if (positions.startPos > bounds.endPos) {
      positions.startPos = bounds.endPos;
    }
    if (positions.endPos > bounds.endPos) {
      positions.startPos = bounds.endPos;
    }
    if (positions.startPos < bounds.startPos) {
      positions.startPos = bounds.startPos;
    }

    if (positions.endPos < bounds.startPos) {
      positions.endPos = bounds.startPos;
    }
    return positions;
  };

export const ensurePrefixComma = (code: string) =>
  code.match(/^\s*,/) ? code : ',' + code;

export const ensureSuffixComma = (code: string) =>
  code.match(/\s*,$/) ? code : code + ',';

export const ensureStmtClosing = (code: string) => {
  code = code.match(/;$/) ? code : code + ';';
  return ensureNewlineClosing(code);
};
export const ensureNewlineClosing = (code: string) =>
  code.match(/\n$/) ? code : code + '\n';

export const ensureCommaDelimiters = (
  code: string,
  { insert, pos, count }: any,
) => {
  const shouldInsertAfter = pos === count || insert.relative === 'after';
  return shouldInsertAfter ? ensurePrefixComma(code) : ensureSuffixComma(code);
};
