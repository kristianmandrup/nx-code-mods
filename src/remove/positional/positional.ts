import { ModifyOptions } from './../../modify/modify-file';
import { ensureCommaDelimiters, ensurePrefixComma } from './../../ensure';
import { AnyOpts, isPresent, removeCode, replaceCode } from '../../modify';
import { Node, SourceFile } from 'typescript';
import { IndexAdj } from '../../types';
import {
  setNodeBounds,
  removeIndexPositions,
  getRemovePosNum,
} from './elements';
import { removeRangePositions } from './range';
import { RemovePosArgs } from './types';

export const normalizeRemoveIndexAdj = (indexAdj: IndexAdj) => {
  indexAdj = indexAdj || {};
  indexAdj.start = indexAdj.start || 0;
  indexAdj.end = indexAdj.end || 0;
  return indexAdj;
};

export const removePositional = (opts: RemovePosArgs) => {
  const { removeIndexPositions, removeRangePositions } = opts;
  return removeIndexPositions(opts) || removeRangePositions(opts);
};

const normalizeRemove = (remove: ModifyOptions, { count }: any) => {
  remove = remove || {};
  if (!remove.relative) {
    remove.relative = 'at';
  }

  // TODO: ensure index within bound
  if (remove.index < 0) {
    remove.index = 0;
  }
  const lastIndex = count - 1;
  if (remove.index >= count) {
    remove.index = lastIndex;
  }
  return remove;
};

export const ensureRemoveCode = (code: string | undefined, opts: any) => {
  const { comma, remove, pos, count, formatCode } = opts;
  if (comma && code) {
    code = ensureCommaDelimiters(code, { insert: remove, pos, count });
    if (pos && pos > 0) {
      code = ensurePrefixComma(code);
    }
  }
  code = code && formatCode ? formatCode(code) : code;
  return code;
};

export const setRemoveFunctions = (opts: any) => {
  opts.removePositional = opts.removePositional || removePositional;
  opts.removeIndexPositions = opts.removeIndexPositions || removeIndexPositions;
  opts.removeRangePositions = opts.insertInElements || removeRangePositions;
  opts.setBounds = opts.setBounds || setNodeBounds;
  opts.getRemovePosNum = opts.getRemovePosNum || getRemovePosNum;
  return opts;
};

export const removeFromNode = (
  srcNode: Node | SourceFile,
  opts: AnyOpts,
): string | undefined => {
  opts = setRemoveFunctions(opts);
  const { removePositional } = opts;
  let { elementsField, node, remove, code, indexAdj, comma } = opts;
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  const elements = node[elementsField];
  if (!elements) {
    console.error('removeFromNode', { node, elementsField });
    throw new Error(
      `removeFromNode: invalid elements field ${elementsField} for node`,
    );
  }
  const count = elements.length;

  remove = normalizeRemove(remove, { count });

  const posOpts = {
    ...opts,
    remove,
    node,
    elements,
    count,
    indexAdj,
  };

  let { positions, pos } = removePositional(posOpts) || {};
  if (!positions) return;

  positions.startPos += indexAdj.start;
  positions.endPos += indexAdj.end;
  opts.pos = pos;

  // TODO: ensureRemoveCode
  code = ensureRemoveCode(code, opts);

  const options = { ...positions, code };

  return isPresent(code)
    ? replaceCode(srcNode, options)
    : removeCode(srcNode, options);
};
