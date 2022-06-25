import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findIfStatementsWithoutElseBlocks } from '../../find';
import { AnyOpts, replaceInSource } from '../../modify';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ifStmtExtractFunction,
  IfStmtExtractResult,
  RefactorIfStmtOpts,
} from './common';
import { IfStatement } from 'typescript';
import {
  insertExtractedFunction,
  replaceWithCallToExtractedFunction,
} from '../common';

// function isCondition({ids}) {
//     if (!condition) return
//     thenStatements
// }
// callFunction(thenFunction, {ids})

export const extractIfThenBlock = (
  srcNode: any,
  stmt: IfStatement,
  opts: AnyOpts,
): IfStmtExtractResult | undefined => {
  const codeParts = ifStmtExtractFunction(stmt, { ...opts, mode: 'then' });
  if (!codeParts) return;
  const { name, fnSrc, callSrc } = codeParts;
  if (!callSrc || !fnSrc) return;
  const { replace } = opts;
  const source =
    replace && replaceWithCallToExtractedFunction(srcNode, callSrc, true);
  return { name, callSrc, fnSrc, source };
};

export const extractThenBlock =
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
    const result = extractIfThenBlock(srcNode, stmt, {
      ...opts,
      replace: true,
    });
    if (!result) return;
    const { source, fnSrc } = result;
    if (!source) return;
    const newSrcNode = tsquery.ast(source);
    return insertExtractedFunction(newSrcNode, fnSrc);
  };

export function refactorThenBlocksToFunctions(
  source: string,
  opts: RefactorIfStmtOpts,
) {
  const findNodeFn = (node: any) => findIfStatementsWithoutElseBlocks(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractThenBlock,
    ...opts,
  });
}
