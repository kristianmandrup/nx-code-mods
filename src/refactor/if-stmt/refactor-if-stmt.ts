import { IfStatement } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findGroupedIfStatements, findIfStatements } from '../../find';
import { AnyOpts, replaceInSource } from '../../modify';
import { RefactorIfStmtOpts } from './if-extract-common';

export const extractIfElseStmtToFunctions = (stmt: IfStatement) => {};
export const extractIfThenStmtToFunctions = (stmt: IfStatement) => {};

export const extractIfStmtToFunctions =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const { code } = opts;
    if (!code) {
      throw new Error('Missing code');
    }
    const group = findGroupedIfStatements(srcNode);
    if (!group) return;
    group?.else?.map((stmt: IfStatement) => {
      extractIfElseStmtToFunctions(stmt);
    });

    group?.then?.map((stmt: IfStatement) => {
      extractIfThenStmtToFunctions(stmt);
    });
  };

export function refactorIfStmtsToFunctions(
  source: string,
  opts: RefactorIfStmtOpts,
) {
  const findNodeFn = (node: any) => findIfStatements(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractIfStmtToFunctions,
    ...opts,
  });
}
