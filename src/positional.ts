export type InsertPosParam = string | number | undefined;

export const getInsertPosNum = (insertPos: string, arrLength: number) => {
  insertPos = insertPos || 'start';
  if (Number.isInteger(insertPos)) {
    let insertPosNum = parseInt('' + insertPos);
    if (insertPosNum <= 0 || insertPosNum >= arrLength) {
      throw new Error(
        `insertIntoArray: Invalid insertPos ${insertPos} argument`,
      );
    }
    return insertPosNum;
  }
  if (insertPos === 'start') {
    return 0;
  }
  if (insertPos === 'end') {
    return arrLength;
  }
  return;
};

export const afterLastElementPos = (literals: any[]) =>
  literals[literals.length - 1].getEnd();

export const beforeElementPos = (literals: any[], pos: number) =>
  literals[pos].getStart();

export const ensurePrefixComma = (codeToInsert: string) =>
  codeToInsert.match(/^\s*,/) ? codeToInsert : ',' + codeToInsert;

export const ensureSuffixComma = (codeToInsert: string) =>
  codeToInsert.match(/\s*,$/) ? codeToInsert : codeToInsert + ',';
