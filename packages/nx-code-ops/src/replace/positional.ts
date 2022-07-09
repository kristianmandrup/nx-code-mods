import { FindElementFn } from '../find';
import { PositionBounds, CollectionIndex, RelativePos } from '../types';
export type CollectionReplace = {
  index?: CollectionIndex;
  between?: PositionBounds;
  findElement?: FindElementFn;
  relative?: RelativePos;
  code?: string;
};
