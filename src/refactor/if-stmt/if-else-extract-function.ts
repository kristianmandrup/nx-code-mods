import { IfStatement } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInSource } from '../../modify';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  insertExtractedFunction,
  RefactorIfStmtOpts,
  replaceWithCallToExtractedFunction,
  srcsFor,
} from './if-extract';
import {
  findIfStatementsWithElseBlocks,
  findIfStatementsWithoutElseBlocks,
  getIfStatementElseBlocks,
} from '../../find';

// function isCondition({ids}) {
//     if (!condition) return
//     thenStatements
// }
// callFunction(thenFunction, {ids})

export const ifElseStmtExtractFunction = (node: IfStatement, opts: AnyOpts) => {
  const blocks = getIfStatementElseBlocks(node);
  if (!blocks) return;
  const elseBlock = blocks[0];
  const expression = node.expression;
  const srcs = srcsFor(elseBlock, expression, opts);
  return {
    node,
    ...srcs,
  };
};

export const extractIfElseBlockToFunctions =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { code } = opts;
    if (!code) {
      throw new Error('Missing code');
    }
    const stmts = findIfStatementsWithoutElseBlocks(srcNode);
    if (!stmts || stmts.length === 0) {
      return;
    }
    const stmt = stmts[0];
    const codeParts = ifElseStmtExtractFunction(stmt, opts);
    if (!codeParts) return;
    const { fnSrc, callSrc } = codeParts;

    const newSource = replaceWithCallToExtractedFunction(srcNode, callSrc);
    const newSrcNode = tsquery.ast(newSource);
    return insertExtractedFunction(newSrcNode, fnSrc);
  };

export function refactorElseBlocksToFunctions(
  source: string,
  opts: RefactorIfStmtOpts,
) {
  const findNodeFn = (node: any) => findIfStatementsWithElseBlocks(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractIfElseBlockToFunctions,
    ...opts,
  });
}
