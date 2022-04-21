import {
  CollectionInsert,
  insertIntoNode,
  InsertRelativePos,
} from './positional';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findClassMethodParameterDeclaration,
} from '../find';
import { AnyOpts, modifyTree, replaceInFile, replaceInSource } from '../modify';
import { SourceFile } from 'typescript';
import { ElementsType } from '../types';
import { afterIndex, beforeIndex } from '../positional';

export interface ClassMethodParamDecoratorInsertOptions {
  classId: string;
  methodId: string;
  paramId: string;
  code: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface ApiClassMethodParamDecoratorInsertOptions {
  classId?: string;
  methodId?: string;
  paramId?: string;
  insert?: CollectionInsert;
  indexAdj?: number;
  code: string;
}

export interface ClassMethodParamDecoratorInsertTreeOptions
  extends ClassMethodParamDecoratorInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const aroundElementPos = (
  elements: ElementsType,
  pos: number,
  relativePos: InsertRelativePos,
) => {
  const element = elements[pos];
  // const maxIndex = elements.length - 1
  // const nextElement = (pos < elements.length - 1) ? elements[pos + 1] : elements[maxIndex]
  return relativePos === 'after' ? afterIndex(element) : beforeIndex(element);
};

export const insertParamDecorator = (opts: AnyOpts) => (srcNode: any) => {
  const { classId, methodId, paramId, insert, code } = opts;
  const node = findClassMethodParameterDeclaration(srcNode, {
    classId: classId,
    methodId,
    paramId,
  });
  if (!node) return;
  return insertIntoNode(srcNode, {
    elementsField: 'decorators',
    aroundElementPos,
    node,
    code,
    insert,
    ...opts,
  });
};

export function insertClassMethodParamDecoratorInSource(
  source: string,
  opts: ClassMethodParamDecoratorInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInSource(source, {
    findNodeFn,
    modifyFn: insertParamDecorator,
    ...opts,
  });
}

export function insertClassMethodParamDecoratorInFile(
  filePath: string,
  opts: ClassMethodParamDecoratorInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertParamDecorator,
    ...opts,
  });
}

export async function insertClassMethodParamDecoratorInTree(
  tree: Tree,
  opts: ClassMethodParamDecoratorInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
