import { endOfIndex, startOfIndex, swapPositions } from './../positional';
import { AnyOpts, removeCode, replaceCode } from '../modify';
import { findElementNode, FindElementFn } from '../find';
import { Node, NodeArray, SourceFile } from 'typescript';
import { BetweenPos, CollectionIndex, IndexAdj, RelativePos } from '../types';

type ElementsType = any[] | NodeArray<any>;

export type RemovePosNumParams = {
  node: Node;
  elements: ElementsType;
  remove: CollectionModifyOpts;
  count: number;
};

export const normalizeRemoveIndexAdj = (indexAdj: IndexAdj) => {
  indexAdj = indexAdj || {};
  indexAdj.start = indexAdj.start || 0;
  indexAdj.end = indexAdj.end || 0;
  return indexAdj;
};

export const createCheckOutOfBounds =
  (maxPos: number) => (pos: number, label: string) => {
    if (!Number.isInteger(pos)) return;
    if (pos < 0 || pos > maxPos) {
      throw new Error(
        `${label} is out of bounds. Must be between 0 and ${maxPos}`,
      );
    }
    return true;
  };

export interface ResolveOpts {
  node: Node;
  elements: ElementsType;
}

export const resolveRangePos = (
  pos: number | FindElementFn,
  opts: ResolveOpts,
) => {
  if (typeof pos === 'function') {
    return findElementNode({ ...opts, findElement: pos });
  }
  return pos;
};

export interface RemovePosRange extends ResolveOpts {
  count: number;
  remove: RemovePosOpts;
}

export const createEnsureValidPositions =
  (bounds: BetweenPos) => (positions: BetweenPos) => {
    if (positions.startPos > positions.endPos) {
      positions = swapPositions(positions);
    }

    if (positions.startPos > bounds.endPos) {
      positions.startPos = bounds.endPos;
    }
    if (positions.endPos > bounds.endPos) {
      positions.startPos = bounds.endPos;
    }
    if (positions.startPos < bounds.startPos) {
      positions.startPos = bounds.startPos;
    }

    if (positions.endPos < bounds.startPos) {
      positions.endPos = bounds.startPos;
    }
  };

const getPositionsInElements = ({
  pos,
  remove,
  count,
  elements,
  bounds,
  ensureValidPositions,
}: any) => {
  const { relative } = remove;
  if (pos === -1) {
    pos = 0;
    remove.relative = 'at';
  }

  if (pos >= count) {
    remove.relative = relative || 'at';
  }
  const removeOpts = { ...remove, elements, count, pos };
  let positions =
    lastElementRemovePos(removeOpts) ||
    midElementRemovePos(removeOpts) ||
    firstElementRemovePos(removeOpts);

  if (!positions.startPos) {
    positions.startPos = bounds.startPos;
  }

  if (!positions.endPos) {
    positions.endPos = bounds.endPos;
  }
  ensureValidPositions(positions);
  return positions;
};

const getPositionsNoElements = ({
  bounds,
  indexAdj,
  ensureValidPositions,
}: any) => {
  return ensureValidPositions({
    startPos: bounds.startPos + indexAdj.start,
    endPos: bounds.endPos + indexAdj.end,
  });
};

export const getPositions = (options: AnyOpts) => {
  const { node, elements, remove, count, indexAdj } = options;

  const bounds = {
    startPos: startOfIndex(node),
    endPos: endOfIndex(node),
  };
  const ensureValidPositions = createEnsureValidPositions(bounds);

  let opts: any = {
    node,
    remove,
    count,
    elements,
    bounds,
    indexAdj,
    ensureValidPositions,
  };

  let pos =
    getRemovePosNum({
      node,
      elements,
      remove,
      count,
    }) || 0;

  const noElements = count === 0;

  opts = {
    ...opts,
    pos,
  };

  return noElements
    ? getPositionsNoElements(opts)
    : getPositionsInElements(opts);
};

export const getRemovePosRange = (opts: AnyOpts) => {
  const { count, remove, node, elements } = opts;
  let { index, between } = remove || {};
  if (index && !between) {
    return;
  }
  const checkOutOfBounds = createCheckOutOfBounds(count - 1);
  if (!between) return;
  let { startPos, endPos } = between;
  checkOutOfBounds(startPos, 'startPos');
  checkOutOfBounds(endPos, 'endPos');
  const posOpts = { node, elements };
  startPos = resolveRangePos(startPos, posOpts);
  endPos = resolveRangePos(endPos, posOpts);
  let positions = {
    startPos,
    endPos,
  };
  if (startPos > endPos) {
    positions = swapPositions(positions);
  }
  return positions;
};

export const getRemovePosNum = ({
  node,
  elements,
  remove,
  count,
}: RemovePosNumParams) => {
  let { findElement, index, between } = remove || {};
  if (!index && between) {
    return;
  }
  if (findElement) {
    return findElementNode({ node, elements, findElement });
  }
  index = index || 'first';
  if (Number.isInteger(index)) {
    let insertPosNum = parseInt('' + index);
    if (insertPosNum <= 0 || insertPosNum >= count) {
      throw new Error(`insertIntoArray: Invalid insertPos ${index} argument`);
    }
    return insertPosNum;
  }
  if (index === 'first') {
    return 0;
  }
  if (index === 'last') {
    return count;
  }
  return;
};

export type CollectionModifyOpts = {
  index?: CollectionIndex;
  between?: BetweenPos;
  findElement?: FindElementFn;
  relative?: RelativePos;
  code?: string;
};

export type RemovePosOpts = {
  elements: ElementsType;
  count: number;
  pos: number;
  remove: CollectionModifyOpts;
};

export const lastElementRemovePos = (opts: RemovePosOpts) => {
  const { elements, count, pos, remove } = opts;
  const { relative } = remove;
  if (pos < count) {
    return;
  }
  const prevElementIndex = elements.length >= 2 ? elements.length - 2 : 0;
  const firstElement = elements[0];
  const firstElementPos = firstElement.getStart();
  const prevElement = elements[prevElementIndex];
  const element = elements[elements.length - 1];
  const prevElemPos = prevElement.getEnd();
  const elemPos = element.getEnd();
  if (relative === 'at') {
    return {
      startPos: prevElemPos,
      endPos: elemPos,
    };
  }
  if (relative === 'before') {
    return {
      startPos: firstElementPos,
      endPos: prevElemPos,
    };
  }
  return {
    startPos: elemPos,
  };
};

export const firstElementRemovePos = (opts: RemovePosOpts) => {
  const { elements, pos, remove } = opts;
  const { relative } = remove;
  if (pos > 0) {
    return;
  }
  const nextElementIndex = 1;
  const firstElement = elements[0];
  const firstElementPos = firstElement.getStart();
  const nextElement = elements[nextElementIndex];
  const nextElemPos = nextElement.getStart();
  if (relative === 'at') {
    return {
      startPos: firstElementPos,
      endPos: nextElemPos,
    };
  }
  if (relative === 'before') {
    return {
      endPos: firstElementPos,
    };
  }
  return {
    startPos: nextElemPos,
  };
};

const getNextElem = (elements: ElementsType, pos: number) => {
  const index = pos + 1 >= elements.length ? elements.length - 1 : pos + 1;
  return elements[index];
};

// TODO: add support for 'at'
export const midElementRemovePos = (opts: RemovePosOpts) => {
  const { elements, pos, remove } = opts;
  const { relative } = remove;
  const element = elements[pos];
  const nextElement = getNextElem(elements, pos);
  const startPos = element.getEnd();
  const endPos = nextElement.getStart();
  if (relative === 'at') {
    return { startPos, endPos };
  }
  return relative === 'after' ? { startPos } : { endPos };
};

export const removeFromNode = (
  srcNode: SourceFile,
  opts: AnyOpts,
): string | undefined => {
  let { elementsField, node, remove, code, indexAdj } = opts;
  remove = remove || {};
  indexAdj = normalizeRemoveIndexAdj(indexAdj);
  const elements = node[elementsField];
  const count = elements.length;

  const posOpts = {
    ...opts,
    srcNode,
    elements,
    count,
    indexAdj,
  };
  const positions = getPositions(posOpts) || getRemovePosRange(posOpts);

  positions.startPos += indexAdj.start;
  positions.endPos += indexAdj.end;

  if (code) {
    return replaceCode(srcNode, { ...positions, code: code });
  }
  return removeCode(srcNode, positions);
};
