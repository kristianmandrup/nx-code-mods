export type InsertPosition = 'start' | 'end';

export const insertCode = (
  vsNode: any,
  insertPosition: number,
  codeToInsert: string,
): string => {
  const previousTxt = vsNode.getFullText();
  const prefix = previousTxt.substring(0, insertPosition);
  const suffix = previousTxt.substring(insertPosition);
  const newTxt = `${prefix}${codeToInsert}${suffix}`;
  return newTxt;
};

export const removeCode = (
  vsNode: any,
  startPos?: number,
  endPos?: number,
): string => {
  const previousTxt = vsNode.getFullText();
  if (!startPos && !endPos) {
    throw new Error(
      `removeCode must be called with a startPos or endPos or both`,
    );
  }
  const beforeCode = startPos ? previousTxt.substring(0, startPos) : '';
  const afterCode = endPos ? previousTxt.substring(endPos) : '';
  const newTxt = `${beforeCode}${afterCode}`;
  return newTxt;
};
