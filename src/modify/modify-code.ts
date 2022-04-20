export type InsertPosition = 'start' | 'end';

export const insertCode = (
  vsNode: any,
  insertPosition: number,
  code: string,
): string => {
  const previousTxt = vsNode.getFullText();
  const prefix = previousTxt.substring(0, insertPosition);
  const suffix = previousTxt.substring(insertPosition);
  const newTxt = `${prefix}${code}${suffix}`;
  return newTxt;
};

export type RemoveCodeOpts = { startPos?: number; endPos?: number };

export const removeCode = (vsNode: any, opts: RemoveCodeOpts): string => {
  const { startPos, endPos } = opts;
  const previousTxt = vsNode.getFullText();
  if (!startPos && !endPos) {
    console.error(opts);
    throw new Error(
      `removeCode must be called with a startPos or endPos or both`,
    );
  }
  if (startPos === endPos) return previousTxt;
  const beforeCode = startPos ? previousTxt.substring(0, startPos) : '';
  const afterCode = endPos ? previousTxt.substring(endPos) : '';
  const newTxt = `${beforeCode}${afterCode}`;
  return newTxt;
};

export interface ReplaceCodeOpts extends RemoveCodeOpts {
  code: string;
}

export const replaceCode = (vsNode: any, opts: ReplaceCodeOpts): string => {
  const { startPos, endPos, code } = opts;
  const previousTxt = vsNode.getFullText();
  if (!code) {
    console.error(opts);
    throw new Error(
      `replaceCode must be called with a code: option with the replacement code`,
    );
  }

  if (!startPos && !endPos) {
    console.error(opts);
    throw new Error(
      `replaceCode must be called with a startPos: or endPos: option or both`,
    );
  }
  if (startPos === endPos) return previousTxt;
  const beforeCode = startPos ? previousTxt.substring(0, startPos) : '';
  const afterCode = endPos ? previousTxt.substring(endPos) : '';
  const newTxt = `${beforeCode}${code}${afterCode}`;
  return newTxt;
};
