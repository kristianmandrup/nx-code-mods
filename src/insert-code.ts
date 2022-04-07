export const insertCode = (vsNode: any, insertPosition: number, codeToInsert: string) => {
    const previousTxt = vsNode.getFullText();
    const prefix = previousTxt.substring(0, insertPosition);
    const suffix = previousTxt.substring(insertPosition);
    const newTxt = `${prefix}${codeToInsert}${suffix}`;
    return newTxt
  }
  