import { CollectionInsert, insertIntoNode } from './positional';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findClassMethodParameterDeclaration,
} from '../find';
import { AnyOpts, modifyTree, replaceInFile, replaceInSource } from '../modify';
import { SourceFile } from 'typescript';

export interface ClassMethodDecParamDecoratorInsertOptions {
  classId: string;
  methodId: string;
  id: string;
  code: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface ClassMethodDecParamDecoratorInsertTreeOptions
  extends ClassMethodDecParamDecoratorInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertParamDecorator =
  (opts: AnyOpts) => (srcNode: SourceFile) => {
    const { classId, methodId, id, insert, code } = opts;
    const node = findClassMethodParameterDeclaration(srcNode, {
      classId: classId,
      methodId,
      paramId: id,
    });
    if (!node) return;
    return insertIntoNode(srcNode, {
      elementsField: 'decorators',
      node,
      code,
      insert,
      ...opts,
    });
  };

export function insertClassMethodParamDecoratorInSource(
  source: string,
  opts: ClassMethodDecParamDecoratorInsertOptions,
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
  opts: ClassMethodDecParamDecoratorInsertOptions,
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
  opts: ClassMethodDecParamDecoratorInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
