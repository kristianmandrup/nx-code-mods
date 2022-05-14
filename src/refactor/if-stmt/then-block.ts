import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findIfStatementsWithoutElseBlocks } from '../../find';
import { AnyOpts, replaceInSource } from '../../modify';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ifStmtExtractFunction,
  insertExtractedFunction,
  RefactorIfStmtOpts,
  replaceWithCallToExtractedFunction,
} from './common';

// function isCondition({ids}) {
//     if (!condition) return
//     thenStatements
// }
// callFunction(thenFunction, {ids})

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
    const codeParts = ifStmtExtractFunction(stmt, { ...opts, mode: 'then' });
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
    modifyFn: extractThenBlock,
    ...opts,
  });
}
