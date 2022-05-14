import { IfStatement, SourceFile } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findGroupedIfStatements, findIfStatements } from '../../find';
import { AnyOpts, replaceInSource } from '../../modify';
import {
  IfStmtExtractResult,
  replaceWithCallToExtractedFunction,
  insertNewFunction,
  insertExtractedFunction,
  RefactorIfStmtOpts,
} from './common';
import { extractIfElseBlock } from './else-block';
import { extractIfThenBlock } from './then-block';
import { tsquery } from '@phenomnomnominal/tsquery';

export const replaceIfStmtWithOrCalls = (
  srcNode: any,
  stmt: IfStatement,
  thenDef: IfStmtExtractResult,
  elseDef: IfStmtExtractResult,
): string => {
  const code = `${thenDef.callSrc} || ${elseDef.callSrc}`;
  const positions = {
    startPos: stmt.getStart(),
    endPos: stmt.getEnd(),
  };
  return replaceWithCallToExtractedFunction(srcNode, {
    positions,
    code,
  });
};

export const extractIfElseStmtToFunctions = (
  srcNode: any,
  stmt: IfStatement,
  opts: AnyOpts,
) => {
  const thenDef = extractIfThenBlock(srcNode, stmt, opts);
  const elseDef = extractIfElseBlock(srcNode, stmt, opts);

  if (!thenDef || !elseDef) return;
  let newSource = replaceIfStmtWithOrCalls(srcNode, stmt, thenDef, elseDef);
  newSource = insertNewFunction(newSource, thenDef.fnSrc);
  newSource = insertNewFunction(newSource, elseDef.fnSrc);
  return newSource;
};

export const extractIfThenStmtToFunctions = (
  srcNode: SourceFile,
  stmt: IfStatement,
  opts: AnyOpts,
) => {
  const then = extractIfThenBlock(srcNode, stmt, { ...opts, replace: true });
  if (!then) return;
  const { source, fnSrc } = then;
  const newSrcNode = tsquery.ast(source);
  const refactoredCode = insertExtractedFunction(newSrcNode, fnSrc);
  return refactoredCode;
};

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
      extractIfElseStmtToFunctions(srcNode, stmt, opts);
    });

    group?.then?.map((stmt: IfStatement) => {
      extractIfThenStmtToFunctions(srcNode, stmt, opts);
    });
  };

export function refactorIfStmtsToFunctions(
  source: string,
  opts: RefactorIfStmtOpts = {},
) {
  const findNodeFn = (node: any) => findIfStatements(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: extractIfStmtToFunctions,
    ...opts,
  });
}
