import { IfStatement } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInSource } from '../../modify';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ifStmtExtractFunction,
  insertExtractedFunction,
  RefactorIfStmtOpts,
  replaceWithCallToExtractedFunction,
  srcsFor,
} from './common';
import {
  findIfStatementsWithElseBlocks,
  findIfStatementsWithoutElseBlocks,
  getIfStatementElseBlocks,
  getIfStatementThenBlocks,
} from '../../find';

// function isCondition({ids}) {
//     if (!condition) return
//     thenStatements
// }
// callFunction(thenFunction, {ids})

export const extractElseBlock =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { code } = opts;
    if (!code) {
      throw new Error('Missing code');
    }
    const stmts = findIfStatementsWithElseBlocks(srcNode);
    if (!stmts || stmts.length === 0) {
      return;
    }
    const stmt = stmts[0];
    const codeParts = ifStmtExtractFunction(stmt, { ...opts, mode: 'else' });
    if (!codeParts) return;
    const { fnSrc, callSrc } = codeParts;

    if (!callSrc || !fnSrc) return;
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
    modifyFn: extractElseBlock,
    ...opts,
  });
}
