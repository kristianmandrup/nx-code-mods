import { conditionName } from './../auto-name/condition/condition-name';
import { Block, Expression, Identifier, IfStatement } from 'typescript';
// if (condition) {
//     trueStatements
// } else {
//     falseStatements
// }

import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findIfStatementsWithElseBlocks, getIfStatementBlocks } from '../find';
import { AnyOpts, replaceInSource } from '../modify';
import { exprToSrcIds } from './utils';
import { blockName } from '../auto-name';

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
  const strIds = exprToSrcIds(block);
  const blockSrc = block.getFullText();
  const pos = block.pos;
  const startPos = block.getStart() - pos + 1;
  const endPos = block.getEnd() - pos - 1;
  const src = blockSrc.substring(startPos, endPos);
  const exprSrc = expr.getFullText();
  return `
  function ${name}(opts: any) {
      const { ${strIds} } = opts
      if (!(${exprSrc})) return;
      ${src}
      return;
  }
`;
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
  const strIds = exprToSrcIds(block);
  return `
    return ${name}({${strIds}})`;
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

export const ifStmtExtractFunction = (node: IfStatement, opts: AnyOpts) => {
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

const extractIfStmtToFunctions =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const stmts = findIfStatementsWithElseBlocks(srcNode);
    if (!stmts || stmts.length === 0) {
      return;
    }
    const stmt = stmts[0];
    const codeParts = ifStmtExtractFunction(stmt, opts);
    // insert and replace code
    return; // modified src code;
  };

export function refactorIfToFunctions(
  source: string,
  opts: RefactorIfStmtOpts,
) {
  const findNodeFn = (node: any) => findIfStatementsWithElseBlocks(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractIfStmtToFunctions,
    ...opts,
  });
}
