import {
  CollectionInsert,
  insertIntoNode,
  InsertRelativePos,
} from './positional';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findClassMethodParameterDeclaration,
  findMatchingDecoratorForNode,
} from '../find';
import { AnyOpts, modifyTree, replaceInFile, replaceInSource } from '../modify';
import { SourceFile, ParameterDeclaration } from 'typescript';
import { ElementsType } from '../types';
import { afterIndex, beforeIndex } from '../positional';
import { ensureSpaceClosing } from '../ensure';

export interface ClassMethodParamDecoratorInsertOptions {
  classId: string;
  methodId: string;
  paramId: string;
  decoratorId: string;
  code: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface ApiClassMethodParamDecoratorInsertOptions {
  classId?: string;
  methodId?: string;
  paramId?: string;
  decoratorId?: string;
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
  const index =
    relativePos === 'after' ? afterIndex(element) : beforeIndex(element);
  return index;
};

const boundsInsertPos = (bounds: any) => {
  return bounds.startPos - 1;
};

const calcPosNoElements = (bounds: any, opts: any) => {
  const { indexAdj } = opts;
  let pos = boundsInsertPos(bounds);
  pos += indexAdj || 0;
  return pos;
};

export const insertParamDecorator = (opts: AnyOpts) => (srcNode: any) => {
  const { classId, methodId, paramId, decoratorId, insert, code } = opts;
  // const methDeclNode = findClassMethodDeclaration(srcNode, {
  //   classId,
  //   methodId,
  // });
  const paramDeclNode = findClassMethodParameterDeclaration(srcNode, {
    classId,
    methodId,
    paramId,
  });
  if (!paramDeclNode) return;

  const abortIfFound = (node: ParameterDeclaration) =>
    findMatchingDecoratorForNode(node, decoratorId);
  if (abortIfFound) {
    const found = abortIfFound(paramDeclNode);
    if (found) {
      return;
    }
  }

  return insertIntoNode(srcNode, {
    elementsField: 'decorators',
    boundsInsertPos,
    formatCode: ensureSpaceClosing,
    calcPosNoElements,
    node: paramDeclNode,
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
