import { Node } from 'typescript';

export type WhereFn = (stmt: Node) => boolean;
