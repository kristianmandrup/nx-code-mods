import { Node } from 'typescript';
import {
  TSQueryOptions,
  TSQueryStringTransformer,
} from '@phenomnomnominal/tsquery/dist/src/tsquery-types';

export function replaceOne(
  source: string,
  node: Node,
  stringTransformer: TSQueryStringTransformer,
): string {
  const match = node;
  const replacement = stringTransformer(node);
  let result = source;
  if (replacement != null) {
    result = `${result.substring(
      0,
      match.getStart(),
    )}${replacement}${result.substring(match.getEnd())}`;
  }
  return result;
}
