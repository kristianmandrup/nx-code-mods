import { conditionName } from './../auto-name/condition/condition-name';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { Expression } from 'typescript';
import { findFirstConditionalExpression } from '../find';
import { AnyOpts, replaceInSource } from '../modify';
import { findAllLocalIds, idsToSrc } from './utils';

export interface DecomposeConditionalOpts {
  name?: string;
}

export interface CreateFnOpts {
  strIds: string;
}

export const createConditionFnCode = (
  name: string,
  expr: Expression,
  opts: CreateFnOpts,
) => {
  const { strIds } = opts;
  const exprSrc = expr.getFullText();
  return `
  function ${name}(opts: any) {
    const { ${strIds} } = opts
    return ${exprSrc};
  }
`;
};

export const createConditionCallSrc = (name: string, opts: CreateFnOpts) => {
  const { strIds } = opts;
  return strIds ? `${name}({${strIds}})` : `${name}()`;
};

export const decomposeConditionalExpr = (
  expr: Expression,
  options: AnyOpts,
) => {
  let { name } = options;
  name = name || conditionName(expr);
  const strIds = idsToSrc(findAllLocalIds(expr));
  const opts = { strIds };
  const callSrc = createConditionCallSrc(name, opts);
  const fnSrc = createConditionFnCode(name, expr, opts);
  return {
    callSrc,
    fnSrc,
  };
};

export const decomposeConditionalSrc =
  (opts: AnyOpts): TSQueryStringTransformer =>
  (srcNode: any): string | null | undefined => {
    const expr = findFirstConditionalExpression(srcNode);
    if (!expr) return;
    const codeParts = decomposeConditionalExpr(expr, opts);
    // insert and replace code
    return; // modified src code;
  };

export function decomposeConditional(
  source: string,
  opts: DecomposeConditionalOpts,
) {
  const findNodeFn = (node: any) => findFirstConditionalExpression(node);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: decomposeConditionalSrc,
    ...opts,
  });
}
