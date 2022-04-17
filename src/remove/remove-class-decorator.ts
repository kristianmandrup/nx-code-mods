import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassDecorator } from '../find';
import {
  removeCode,
  replaceInFile,
  AnyOpts,
  modifyTree,
  replaceInSource,
} from '../modify';
import { Node, SourceFile } from 'typescript';

export interface ClassDecoratorRemoveOptions {
  classId: string;
  decoratorId: string;
}

export interface ClassDecoratorRemoveTreeOptions
  extends ClassDecoratorRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeBeforeClassDecl = (opts: AnyOpts) => (node: Node) => {
  const { decoratorId, classId } = opts;
  const decorator = findClassDecorator(node, {
    classId: classId,
    decoratorId,
  });
  if (!decorator) {
    return;
  }
  const startPos = decorator.getStart();
  const endPos = decorator.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeClassDecoratorInSource(
  source: string,
  opts: ClassDecoratorRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.decoratorId);

  return replaceInSource(source, {
    findNodeFn,
    modifyFn: removeBeforeClassDecl,
    ...opts,
  });
}

export function removeClassDecoratorInFile(
  filePath: string,
  opts: ClassDecoratorRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.decoratorId);

  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeBeforeClassDecl,
    ...opts,
  });
}

export async function removeClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecoratorRemoveTreeOptions,
) {
  return await modifyTree(tree, opts);
}
