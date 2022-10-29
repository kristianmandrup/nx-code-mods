import { removeCode } from './../../modify/modify-code';
import { IfStatement, SourceFile } from 'typescript';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { findGroupedIfStatements, findIfStatements } from '../../find';
import { AnyOpts, replaceInSource } from '../../modify';
import { IfStmtExtractResult, RefactorIfStmtOpts } from './common';
import { extractIfElseBlock } from './else-block';
import { extractIfThenBlock } from './then-block';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  insertExtractedFunction,
  insertNewFunction,
  replaceWithCallToExtractedFunction,
} from '../common';

export const replaceIfStmtWithOrCalls = (
  srcNode: any,
  stmt: IfStatement,
  thenDef: IfStmtExtractResult,
  elseDef: IfStmtExtractResult,
): string => {
  const code = `${thenDef.callSrc.code} || ${elseDef.callSrc.code}`;
  const positions = {
    startPos: stmt.getStart(),
    endPos: stmt.getEnd(),
  };
  return replaceWithCallToExtractedFunction(
    srcNode,
    {
      positions,
      code,
    },
    true,
  );
};

export const extractIfElseStmtToFunctions = (
  srcNode: any,
  stmt: IfStatement,
  opts: AnyOpts,
) => {
  opts = { minBlockSize: 0, ...opts };
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
  opts: AnyOpts = {},
) => {
  const then = extractIfThenBlock(srcNode, stmt, { ...opts, replace: true });
  if (!then) return;
  const { source, fnSrc } = then;
  const newSrcNode = tsquery.ast(source);
  return insertExtractedFunction(newSrcNode, fnSrc);
};

export const extractIfStmtToFunctions =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const group = findGroupedIfStatements(srcNode);
    if (!group) return;
    let source: any;
    let newSrcNode: any;
    group?.else?.map((stmt: IfStatement) => {
      newSrcNode = source ? tsquery.ast(source) : srcNode;
      source = extractIfElseStmtToFunctions(newSrcNode, stmt, opts);
    });

    group?.then?.map((stmt: IfStatement) => {
      newSrcNode = source ? tsquery.ast(source) : srcNode;
      source = extractIfThenStmtToFunctions(srcNode, stmt, opts);
    });
    return source;
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
