import { FindElementFn, findElementNode } from '../../find';
import { swapPositions } from '../../positional';
import { RemovePosArgs, ResolveOpts } from './types';

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

export const resolveRangePos = (
  pos: number | FindElementFn,
  opts: ResolveOpts,
): number => {
  if (Number.isInteger(pos)) {
    return pos as number;
  } else {
    let index = findElementNode({ ...opts, findElement: pos as FindElementFn });
    if (!index) {
      console.error('resolveRangePos', { pos });
      throw new Error('Unable to find matching element');
    }
    return index;
  }
};

export const getRemovePosRange = (opts: RemovePosArgs) => {
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