import { AnyOpts, removeCode, replaceCode } from '../../modify';
import { Node, SourceFile } from 'typescript';
import { IndexAdj } from '../../types';
import { getIndexPositions } from './elements';
import { getRemovePosRange } from './range';
import { RemovePosArgs } from './types';

export const normalizeRemoveIndexAdj = (indexAdj: IndexAdj) => {
  indexAdj = indexAdj || {};
  indexAdj.start = indexAdj.start || 0;
  indexAdj.end = indexAdj.end || 0;
  return indexAdj;
};

export const getPositions = (posOpts: RemovePosArgs) =>
  getIndexPositions(posOpts) || getRemovePosRange(posOpts);

export const removeFromNode = (
  srcNode: Node | SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { elementsField, node, remove, code, indexAdj } = opts;
  remove = remove || {};
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  const elements = node[elementsField];
  const count = elements.length;

  const posOpts = {
    ...opts,
    node: srcNode,
    elements,
    count,
    indexAdj,
  };
  const positions = getPositions(posOpts);
  if (!positions) return;

  positions.startPos += indexAdj.start;
  positions.endPos += indexAdj.end;

  if (code) {
    return replaceCode(srcNode, { ...positions, code: code });
  }
  return removeCode(srcNode, positions);
};
