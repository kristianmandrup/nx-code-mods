import { createEnsureValidPositions } from '../../ensure';
import { findElementNode } from '../../find';
import { endOfIndex, startOfIndex } from '../../positional';
import { PositionBounds, ElementsType } from '../../types';
import { RemovePosArgs, RemovePosOpts } from './types';

const hasValidBetween = (between?: PositionBounds) => {
  if (!between) return false;
  if (!(between.startPos && between.endPos)) return false;
  return true;
};

export const getRemovePosNum = ({
  node,
  elements,
  remove,
  count,
}: RemovePosArgs) => {
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

export const lastElementRemovePos = (opts: RemovePosOpts) => {
  let { elements, count, pos, remove } = opts;
  remove = remove || {};
  const { relative } = remove;
  if (pos < count - 1) {
    return;
  }
  const lastIndex = elements.length - 1;
  const prevElementIndex = lastIndex >= 1 ? lastIndex - 1 : 0;

  const firstElement = elements[0];
  const prevElement = elements[prevElementIndex];
  const element = elements[lastIndex];

  const firstElementPos = firstElement.getStart();
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
  let { elements, pos, remove } = opts;
  remove = remove || {};
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

export const midElementRemovePos = (opts: RemovePosOpts) => {
  let { elements, pos, remove } = opts;
  remove = remove || {};
  const { relative } = remove;
  const element = elements[pos];
  const nextElement = getNextElem(elements, pos);

  let startPos = element.getEnd();
  let endPos = nextElement.getStart();

  if (nextElement === element) {
    startPos = element.getStart();
    endPos = element.getEnd();
  }

  if (relative === 'at') {
    return { startPos, endPos };
  }
  return relative === 'after' ? { startPos } : { endPos };
};

const getNextElem = (elements: ElementsType, pos: number) => {
  const index = pos + 1 >= elements.length ? elements.length - 1 : pos + 1;
  return elements[index];
};

const getRemovePositionsInElements = ({
  pos,
  remove,
  count,
  elements,
  bounds,
  ensureValidPositions,
}: any) => {
  remove = remove || {};
  const { relative } = remove || {};
  if (pos === -1) {
    pos = 0;
    remove.relative = 'at';
  }
  if (pos >= count) {
    remove.relative = relative || 'at';
  }

  const removeOpts = { remove, elements, count, pos };
  let positions =
    lastElementRemovePos(removeOpts) ||
    firstElementRemovePos(removeOpts) ||
    midElementRemovePos(removeOpts);

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

export const removeIndexPositions = (options: RemovePosArgs) => {
  let { node, elements, remove, count, indexAdj } = options;
  remove = remove || {};
  const { between } = remove;
  if (hasValidBetween(between)) return;

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

  let positions = noElements
    ? getPositionsNoElements(opts)
    : getRemovePositionsInElements(opts);

  ensureValidPositions(positions);
  return { positions, pos };
};
