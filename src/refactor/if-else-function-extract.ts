import { Block, Expression, Identifier, IfStatement } from 'typescript';
// if (condition) {
//     trueStatements
// } else {
//     falseStatements
// }

import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import {
  findAllIdentifiersFor,
  findIfStatementsWithElseBlocks,
  getIfStatementBlocks,
} from '../find';
import { AnyOpts, replaceInSource } from '../modify';
import { mapIdentifiersToSrc } from './utils';

// function notCondition({ids}) {
//     if (condition) return
//     falseStatements
// }
// function isCondition({ids}) {
//     if (!condition) return
//     trueStatements
// }
// callFunction(trueFunction, {ids}) || callFunction(falseFunction, {ids})

interface RefactorIfElseOpts {
  conditionName: string;
}

export const createThenFnCode = (
  conditionName: string,
  expr: Expression,
  block: Block,
  opts: any,
) => {
  const { strIds } = opts;
  const blockSrc = block.getFullText();
  const exprSrc = strIds ? `${conditionName}({${strIds}})` : expr.getFullText();
  return `
  function then${conditionName}(opts: any) {
      if (!${exprSrc}) return;
      ${blockSrc}
      return
  }
`;
};

export const createElseFnCode = (
  conditionName: string,
  expr: Expression,
  block: Block,
  opts: any,
) => {
  const { strIds } = opts;
  const blockSrc = block.getFullText();
  const exprSrc = strIds ? `${conditionName}({${strIds}})` : expr.getFullText();
  return `
    function then${conditionName}(opts: any) {
        if (${exprSrc}) return;
        ${blockSrc}
        return
    }
  `;
};

export const replaceIfElseWithCalls = (
  conditionName: string,
  { thenIds, elseIds }: { thenIds: Identifier[]; elseIds: Identifier[] },
) => {
  const thenStrIds = mapIdentifiersToSrc(thenIds);
  const elseStrIds = mapIdentifiersToSrc(elseIds);
  return `
    return then${conditionName}({${thenStrIds}}) || else${conditionName}({${elseStrIds}})
    `;
};

const createConditionFnCode = (
  conditionName: string,
  expr: Expression,
  opts: any,
) => {
  const { ids } = opts;
  const exprSrc = expr.getFullText();
  return `
  function ${conditionName}({${ids}}: any) {
      return ${exprSrc}
  }
  `;
};

const extractIfStmtWithElseToFunctions = (node: IfStatement, opts: AnyOpts) => {
  const { conditionName } = opts;
  const expr = node.expression;
  const blocks = getIfStatementBlocks(node);
  if (!blocks) return;
  const { thenBlock, elseBlock } = blocks;

  const exprSrc = expr.getFullText();
  let conditionFnCode, ids, strIds;
  if (exprSrc.length > 10) {
    ids = findAllIdentifiersFor(expr);
    strIds = mapIdentifiersToSrc(ids);
    conditionFnCode = createConditionFnCode(conditionName, expr, {
      ids: strIds,
    });
  }
  const fnOpts = { conditionFnCode, ids, strIds };
  const thenIds = findAllIdentifiersFor(thenBlock);
  const elseIds = findAllIdentifiersFor(elseBlock);
  const thenFnCode = createThenFnCode(conditionName, expr, thenBlock, fnOpts);
  const elseFnCode = createElseFnCode(conditionName, expr, elseBlock, fnOpts);
  const replaceCode = replaceIfElseWithCalls(conditionName, {
    thenIds,
    elseIds,
  });
  return {
    node,
    thenFnCode,
    elseFnCode,
    replaceCode,
  };
};

const extractIfElseStmtsToFunctions =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const stmts = findIfStatementsWithElseBlocks(srcNode);
    if (!stmts || stmts.length === 0) {
      return;
    }
    const stmt = stmts[0];
    const codeParts = extractIfStmtWithElseToFunctions(stmt, opts);
    // insert and replace code
    return; // modified src code;
  };

export function refactorIfElseToFunctions(
  source: string,
  opts: RefactorIfElseOpts,
) {
  const findNodeFn = (node: any) => findIfStatementsWithElseBlocks(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractIfElseStmtsToFunctions,
    ...opts,
  });
}
