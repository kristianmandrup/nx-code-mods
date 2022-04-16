import { FindElementFn } from '../find';
import { BetweenPos, CollectionIndex, RelativePos } from '../types';
export type CollectionReplace = {
  index?: CollectionIndex;
  between?: BetweenPos;
  findElement?: FindElementFn;
  relative?: RelativePos;
  replacementCode?: string;
};
