import { IfStatement } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { AnyOpts, replaceInSource } from '../../modify';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  ifStmtExtractFunction,
  IfStmtExtractResult,
  RefactorIfStmtOpts,
} from './common';
import { findIfStatementsWithElseBlocks } from '../../find';
import {
  insertExtractedFunction,
  replaceWithCallToExtractedFunction,
} from '../common';

export const extractIfElseBlock = (
  srcNode: any,
  stmt: IfStatement,
  opts: AnyOpts,
): IfStmtExtractResult | undefined => {
  const codeParts = ifStmtExtractFunction(stmt, { ...opts, mode: 'else' });
  if (!codeParts) return;
  const { name, fnSrc, callSrc } = codeParts;

  if (!callSrc || !fnSrc) return;
  const source =
    opts.replace && replaceWithCallToExtractedFunction(srcNode, callSrc, true);
  return { name, callSrc, fnSrc, source };
};

export const extractElseBlock =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const stmts = findIfStatementsWithElseBlocks(srcNode);
    if (!stmts || stmts.length === 0) {
      return;
    }
    const stmt = stmts[0];
    const result = extractIfElseBlock(srcNode, stmt, {
      ...opts,
      replace: true,
    });
    if (!result) return;
    const { source, fnSrc } = result;
    if (!source) return;
    const newSrcNode = tsquery.ast(source);
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
