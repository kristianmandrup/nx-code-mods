import { NodeArray } from 'typescript';

export type ElementsType = any[] | NodeArray<any>;

export type CollectionIndex = 'first' | 'last' | number;

export type BetweenPos = {
  startPos: number;
  endPos: number;
};

export type IndexAdj = {
  start?: number;
  end?: number;
};

export type RelativePos = 'before' | 'after' | 'at';
