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
