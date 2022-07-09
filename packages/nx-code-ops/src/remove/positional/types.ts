import { Node, NodeArray } from 'typescript';
import { FindElementFn } from '../../find';
import {
  PositionBounds,
  CollectionIndex,
  ElementsType,
  RelativePos,
} from '../../types';

export interface ResolveOpts {
  node: Node;
  elements: ElementsType;
}

export interface RemovePosArgs extends ResolveOpts {
  count: number;
  indexAdj?: number;
  remove?: CollectionModifyOpts;
  [key: string]: any;
}

export type CollectionModifyOpts = {
  index?: CollectionIndex;
  between?: PositionBounds;
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
