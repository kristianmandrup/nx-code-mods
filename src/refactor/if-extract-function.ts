import { conditionName } from './../auto-name/condition/condition-name';
import { Block, Expression, Identifier, IfStatement } from 'typescript';
// if (condition) {
//     trueStatements
// } else {
//     falseStatements
// }

import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import {
  findIfStatements,
  findIfStatementsWithElseBlocks,
  getIfStatementBlocks,
} from '../find';
import { AnyOpts, insertCode, replaceCode, replaceInSource } from '../modify';
import { blockName } from '../auto-name';
import { findAllLocalIds, idsToSrc } from './utils';
import { tsquery } from '@phenomnomnominal/tsquery';
import { getPosAfterLastImport } from '../append';
import { PositionBounds } from '../types';

// function isCondition({ids}) {
//     if (!condition) return
//     thenStatements
// }
// callFunction(thenFunction, {ids})

export interface RefactorIfStmtOpts {
  condName: string;
  fnName: string;
}

export const createFnCode = (block: Block, expr: Expression, opts: any) => {
  let { name } = opts;
  name = name || blockName(block);
  const strIds = idsToSrc(findAllLocalIds(expr));

  const blockSrc = block.getFullText();
  const pos = block.pos;
  const startPos = block.getStart() - pos + 1;
  const endPos = block.getEnd() - pos - 1;
  const src = blockSrc.substring(startPos, endPos);
  const exprSrc = expr.getFullText();
  const positions = { startPos: block.getStart(), endPos: block.getEnd() };
  const insertPos = getPosAfterLastImport(block.getSourceFile());
  const code = `
  function ${name}(opts: any) {
      const { ${strIds} } = opts
      if (!(${exprSrc})) return;
      ${src}
      return;
  }
  `;
  return {
    insertPos,
    positions,
    code,
  };
};

export const ifStmtToCall = (
  block: Block,
  {
    name,
  }: {
    name: string;
  },
) => {
  name = name || blockName(block);
  const strIds = idsToSrc(findAllLocalIds(block));
  const code = `
    return ${name}({${strIds}})`;
  const positions = { startPos: block.getStart(), endPos: block.getEnd() };
  const insertPos = getPosAfterLastImport(block.getSourceFile());
  return {
    code,
    positions,
    insertPos,
  };
};

export const srcsFor = (block: Block, expr: Expression, opts: any) => {
  const name = opts.name || blockName(block);
  opts.name = name;
  const fnSrc = createFnCode(block, expr, opts);
  const callSrc = ifStmtToCall(block, opts);
  return {
    fnSrc,
    callSrc,
  };
};

export const ifThenStmtExtractFunction = (node: IfStatement, opts: AnyOpts) => {
  const blocks = getIfStatementBlocks(node);
  if (!blocks) return;
  const { thenBlock } = blocks;
  const expression = node.expression;
  const srcs = srcsFor(thenBlock, expression, opts);
  return {
    node,
    ...srcs,
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

export const extractIfThenStmtToFunctions =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { code } = opts;
    if (!code) {
      throw new Error('Missing code');
    }
    const stmts = findIfStatements(srcNode);
    if (!stmts || stmts.length === 0) {
      return;
    }
    const stmt = stmts[0];
    const codeParts = ifThenStmtExtractFunction(stmt, opts);
    if (!codeParts) return;
    const { fnSrc, callSrc } = codeParts;

    const newSource = replaceWithCallToExtractedFunction(srcNode, callSrc);
    const newSrcNode = tsquery.ast(newSource);
    return insertExtractedFunction(newSrcNode, fnSrc);
  };

export function refactorIfToFunctions(
  source: string,
  opts: RefactorIfStmtOpts,
) {
  const findNodeFn = (node: any) => findIfStatementsWithElseBlocks(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractIfThenStmtToFunctions,
    ...opts,
  });
}
