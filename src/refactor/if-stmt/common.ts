import { Block, Expression, IfStatement, isDefaultClause } from 'typescript';
import { AnyOpts, insertCode, replaceCode } from '../../modify';
import { blockName } from '../../auto-name';
import { findAllLocalRefIds, idsToSrc } from '../utils';
import { getPosAfterLastImport } from '../../append';
import { PositionBounds } from '../../types';
import { getIfStatementElseBlocks, getIfStatementThenBlocks } from '../../find';
import { tsquery } from '@phenomnomnominal/tsquery';
export interface RefactorIfStmtOpts {
  condName?: string;
  fnName?: string;
}

export const createFnCode = (block: Block, expr: Expression, opts: any) => {
  let { name, inverseGuard } = opts;
  name = name || blockName(block);
  const ids = findAllLocalRefIds(block);
  const strIds = idsToSrc(ids);
  const blockSrc = block.getFullText();
  const pos = block.pos;
  const startPos = block.getStart() - pos + 1;
  const endPos = block.getEnd() - pos - 1;
  const src = blockSrc.substring(startPos, endPos);
  const exprSrc = expr.getFullText();
  const insertPos = getPosAfterLastImport(block.getSourceFile());
  const guardClauseCode = inverseGuard ? `!(${exprSrc})` : exprSrc;
  const code = `
    function ${name}(opts: any) {
        const { ${strIds} } = opts
        if (${guardClauseCode}) return;
        ${src}
        return;
    }
    `;
  return {
    insertPos,
    code,
  };
};

export const ifStmtBlockToCall = (
  block: Block,
  {
    name,
  }: {
    name?: string;
  },
): ReplaceDef => {
  name = name || blockName(block);
  const ids = findAllLocalRefIds(block);
  const strIds = idsToSrc(ids);
  const code = `
      return ${name}({${strIds}})`;
  const positions = { startPos: block.getStart(), endPos: block.getEnd() };
  return {
    code,
    positions,
  };
};

const defaults = {
  minBlockSize: 3,
};

export const srcsFor = (block: Block, expr: Expression, opts: any = {}) => {
  const inverseGuard = opts.mode === 'then';
  opts = {
    ...defaults,
    inverseGuard,
    ...opts,
  };
  const { minBlockSize } = opts;
  // ignore any blocks for refactor with less than 3 statements
  if (block.statements.length < minBlockSize) return;
  const name = opts.name || blockName(block);
  opts.name = name;
  const fnSrc = createFnCode(block, expr, opts);
  const callSrc = ifStmtBlockToCall(block, opts);
  return {
    name,
    fnSrc,
    callSrc,
  };
};

const modeMap: any = {
  else: getIfStatementElseBlocks,
  then: getIfStatementThenBlocks,
};

export const ifStmtExtractFunction = (node: IfStatement, opts: AnyOpts) => {
  const { mode } = opts;
  const getBlocksFn = modeMap[mode];
  if (!getBlocksFn) {
    throw new Error('Invalid mode ');
  }
  const blocks = getBlocksFn(node);
  if (!blocks) return;
  const block = blocks[0];
  const expression = node.expression;
  const srcs = srcsFor(block, expression, opts);
  return {
    node,
    ...srcs,
  };
};

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

export type IfStmtExtractResult = {
  name: string;
  source: string;
  callSrc: ReplaceDef;
  fnSrc: InsertDef;
};

export const insertExtractedFunction = (srcNode: any, insertDef: InsertDef) => {
  return insertCode(srcNode, insertDef.insertPos, insertDef.code);
};

export const replaceWithCallToExtractedFunction = (
  srcNode: any,
  replaceDef: ReplaceDef,
) => {
  const opts = { ...replaceDef.positions, code: replaceDef.code };
  return replaceCode(srcNode, opts);
};
