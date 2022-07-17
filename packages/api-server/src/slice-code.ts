export type FlexPositionBounds = {
  startPos?: number;
  endPos?: number;
};

export const validatePositions = (
  code: string,
  positions?: FlexPositionBounds
) => {
  const { startPos, endPos } = positions || {};
  if (startPos && startPos < 0) {
    throw new Error("invalid startPos < 0");
  }
  if (endPos && endPos < 0) {
    throw new Error("invalid endPos < 0");
  }
  if (endPos && endPos > code.length) {
    throw new Error("invalid endPos > code length");
  }
  if (endPos && startPos && endPos < startPos) {
    throw new Error("invalid endPos < startPos");
  }
};

export const sliceCode = (code: string, positions?: FlexPositionBounds) => {
  const { startPos, endPos } = positions || {};
  validatePositions(code, positions);
  return endPos ? code.slice(startPos, endPos) : code.slice(startPos);
};
