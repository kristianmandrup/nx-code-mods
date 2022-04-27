import { conditionName } from './../auto-name/condition/condition-name';
import { TSQueryStringTransformer } from '@phenomnomnominal/tsquery/dist/src/tsquery-types';
import { Expression, Identifier, PropertyAccessExpression } from 'typescript';
import { findAllIdentifiersFor, findFirstConditionalExpression } from '../find';
import { AnyOpts, replaceInSource } from '../modify';
import { mapIdentifiersToSrc, mapIdentifiersToTxtList } from './utils';

export interface DecomposeConditionalOpts {
  name?: string;
}

export interface CreateFnOpts {
  strIds: string;
}

export const createFnCode = (
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

export const createCallSrc = (name: string, opts: CreateFnOpts) => {
  const { strIds } = opts;
  return strIds ? `${name}({${strIds}})` : `${name}()`;
};

const filterChildIds = (ids: Identifier[]) => {
  return ids.filter((id) => {
    const idStr = id.escapedText as string;
    const parentId = id.parent;
    const propAccess = parentId as PropertyAccessExpression;
    const propAccessCode = propAccess.getFullText();
    const dotParts = propAccessCode.split('.');
    const lastDotPart = dotParts[dotParts.length - 1];
    if (lastDotPart === idStr) return false;
    return true;
  });
};

export const decomposeConditionalExpr = (
  expr: Expression,
  options: AnyOpts,
) => {
  let { name } = options;
  name = name || conditionName(expr);
  const ids = findAllIdentifiersFor(expr);
  const filteredIds = filterChildIds(ids);
  const strIds = mapIdentifiersToSrc(filteredIds);
  const opts = { strIds };
  const callSrc = createCallSrc(name, opts);
  const fnSrc = createFnCode(name, expr, opts);
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
