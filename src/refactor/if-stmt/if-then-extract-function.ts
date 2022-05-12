import { IfStatement } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import {
  findIfStatementsWithoutElseBlocks,
  getIfStatementThenBlocks,
} from '../../find';
import { AnyOpts, replaceInSource } from '../../modify';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  insertExtractedFunction,
  RefactorIfStmtOpts,
  replaceWithCallToExtractedFunction,
  srcsFor,
} from './if-extract';

// function isCondition({ids}) {
//     if (!condition) return
//     thenStatements
// }
// callFunction(thenFunction, {ids})

export const ifThenStmtExtractFunction = (node: IfStatement, opts: AnyOpts) => {
  const blocks = getIfStatementThenBlocks(node);
  if (!blocks) return;
  const thenBlock = blocks[0];
  const expression = node.expression;
  const srcs = srcsFor(thenBlock, expression, opts);
  return {
    node,
    ...srcs,
  };
};

export const extractIfThenStmtToFunctions =
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
    const codeParts = ifThenStmtExtractFunction(stmt, opts);
    if (!codeParts) return;
    const { fnSrc, callSrc } = codeParts;
    if (!callSrc || !fnSrc) return;

    const newSource = replaceWithCallToExtractedFunction(srcNode, callSrc);
    const newSrcNode = tsquery.ast(newSource);
    return insertExtractedFunction(newSrcNode, fnSrc);
  };

export function refactorThenBlocksToFunctions(
  source: string,
  opts: RefactorIfStmtOpts,
) {
  const findNodeFn = (node: any) => findIfStatementsWithoutElseBlocks(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractIfThenStmtToFunctions,
    ...opts,
  });
}
