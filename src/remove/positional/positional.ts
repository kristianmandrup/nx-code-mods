import { ensureCommaDelimiters, ensurePrefixComma } from './../../ensure';
import { AnyOpts, removeCode, replaceCode } from '../../modify';
import { Node, SourceFile } from 'typescript';
import { IndexAdj } from '../../types';
import { getIndexPositions } from './elements';
import { getRangePositions } from './range';
import { RemovePosArgs } from './types';

export const normalizeRemoveIndexAdj = (indexAdj: IndexAdj) => {
  indexAdj = indexAdj || {};
  indexAdj.start = indexAdj.start || 0;
  indexAdj.end = indexAdj.end || 0;
  return indexAdj;
};

export const getPositions = (posOpts: RemovePosArgs) =>
  getIndexPositions(posOpts) || getRangePositions(posOpts);

export const removeFromNode = (
  srcNode: Node | SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { elementsField, node, remove, code, indexAdj, comma } = opts;
  remove = remove || {};
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  const elements = node[elementsField];
  if (!elements) {
    console.error('removeFromNode', { node, elementsField });
    throw new Error(
      `removeFromNode: invalid elements field ${elementsField} for node`,
    );
  }
  const count = elements.length;

  if (!remove.relative) {
    remove.relative = 'at';
  }

  // TODO: ensure index within bound
  if (remove.index < 0) {
    remove.index = 0;
  }
  if (remove.index >= count) {
    remove.index = count - 1;
  }

  const posOpts = {
    ...opts,
    remove,
    node,
    elements,
    count,
    indexAdj,
  };
  let { positions, pos } = getPositions(posOpts) || {};
  if (!positions) return;

  positions.startPos += indexAdj.start;
  positions.endPos += indexAdj.end;
  if (comma && code) {
    code = ensureCommaDelimiters(code, { insert: remove, pos, count });
    if (pos && pos > 0) {
      code = ensurePrefixComma(code);
    }
  }
  const options = { ...positions, code: code };
  return code ? replaceCode(srcNode, options) : removeCode(srcNode, options);
};
