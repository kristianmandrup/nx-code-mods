import { tsquery } from '@phenomnomnominal/tsquery';
import { insertCode, replaceCode } from '../modify';
import { PositionBounds } from '../types';

export interface InsertDef {
  code: string;
  insertPos: number;
}

export interface ReplaceDef {
  code: string;
  positions: PositionBounds;
}

export const insertNewFunction = (source: string, insertDef: InsertDef) => {
  const srcNode = tsquery.ast(source);
  return insertExtractedFunction(srcNode, insertDef);
};

export const insertExtractedFunction = (srcNode: any, insertDef: InsertDef) => {
  return insertCode(srcNode, insertDef.insertPos, insertDef.code);
};

export const replaceWithCallToExtractedFunction = (
  srcNode: any,
  replaceDef: ReplaceDef,
  withReturn: boolean = false,
) => {
  let { code } = replaceDef;
  code = withReturn ? `return ${code}` : code;
  const opts = { ...replaceDef.positions, code };
  return replaceCode(srcNode, opts);
};
