import { ModifyOptions } from './../../modify/modify-file';
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
  const lastIndex = count - 1;
  if (pos < lastIndex) {
    return;
  }
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

export const getElementRemovePositions = (opts: any) => {
  const { lastElementRemovePos, firstElementRemovePos, midElementRemovePos } =
    opts;
  return (
    lastElementRemovePos(opts) ||
    firstElementRemovePos(opts) ||
    midElementRemovePos(opts)
  );
};

const ensureElementRemovePositions = (positions: any, bounds: any) => {
  if (!positions.startPos) {
    positions.startPos = bounds.startPos;
  }

  if (!positions.endPos) {
    positions.endPos = bounds.endPos;
  }
  return positions;
};

const normalizeElementsRemove = (
  remove: ModifyOptions,
  { pos, count }: any,
) => {
  remove = remove || {};
  const { relative } = remove || {};
  if (pos === -1) {
    pos = 0;
    remove.relative = 'at';
  }
  if (pos >= count) {
    remove.relative = relative || 'at';
  }
  return remove;
};

const getRemovePositionsInElements = (opts: any) => {
  let { validatePos, ensureValidPositions, bounds, remove } = opts;
  remove = normalizeElementsRemove(remove, opts);
  let positions = getElementRemovePositions(opts);
  ensureElementRemovePositions(positions, bounds);
  if (validatePos) {
    ensureValidPositions(positions);
  }
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

export const setRemoveInElementsFunctions = (opts: any) => {
  opts.getPositionsNoElements =
    opts.getPositionsNoElements || getPositionsNoElements;
  opts.getRemovePositionsInElements =
    opts.getRemovePositionsInElements || getRemovePositionsInElements;
  opts.getElementRemovePositions =
    opts.getElementRemovePositions || getElementRemovePositions;
  opts.lastElementRemovePos = opts.lastElementRemovePos || lastElementRemovePos;
  opts.firstElementRemovePos =
    opts.firstElementRemovePos || firstElementRemovePos;
  opts.midElementRemovePos = opts.midElementRemovePos || midElementRemovePos;
  return opts;
};

const getElementIndexPositions = (opts: any, noElements: boolean) => {
  setRemoveInElementsFunctions(opts);
  const { getPositionsNoElements, getRemovePositionsInElements } = opts;
  return noElements
    ? getPositionsNoElements(opts)
    : getRemovePositionsInElements(opts);
};

export const setNodeBounds = (node: any, opts: any) => ({
  startPos: startOfIndex(node),
  endPos: endOfIndex(node),
});

export const removeIndexPositions = (options: RemovePosArgs) => {
  const { validatePos, setBounds, getRemovePosNum } = options;
  let { node, elements, remove, count, indexAdj } = options;
  remove = remove || {};
  const { between } = remove;
  if (hasValidBetween(between)) return;

  const bounds = setBounds(node, options);

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

  let positions = getElementIndexPositions(opts, noElements);

  if (validatePos) {
    ensureValidPositions(positions);
  }
  return { positions, pos };
};
