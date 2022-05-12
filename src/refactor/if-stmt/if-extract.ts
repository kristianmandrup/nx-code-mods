import { Block, Expression } from 'typescript';
import { insertCode, replaceCode } from '../../modify';
import { blockName } from '../../auto-name';
import { findAllLocalRefIds, idsToSrc } from '../utils';
import { getPosAfterLastImport } from '../../append';
import { PositionBounds } from '../../types';
export interface RefactorIfStmtOpts {
  condName: string;
  fnName: string;
}

export const createFnCode = (block: Block, expr: Expression, opts: any) => {
  let { name } = opts;
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
  const code = `
    function ${name}(opts: any) {
        const { ${strIds} } = opts
        if (${exprSrc}) return;
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
) => {
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

export const srcsFor = (block: Block, expr: Expression, opts: any) => {
  // ignore any blocks for refactor with less than 3 statements
  if (block.statements.length < 3) return;
  const name = opts.name || blockName(block);
  opts.name = name;
  const fnSrc = createFnCode(block, expr, opts);
  const callSrc = ifStmtBlockToCall(block, opts);
  return {
    fnSrc,
    callSrc,
  };
};

interface InsertDef {
  code: string;
  insertPos: number;
}

interface ReplaceDef {
  code: string;
  positions: PositionBounds;
}

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
