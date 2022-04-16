import { Tree } from '@nrwl/devkit';
import { findClassDeclaration, findClassDecorator } from '../find';
import { removeCode, replaceInFile, AnyOpts, modifyTree } from '../modify';
import { Node, SourceFile } from 'typescript';

export interface ClassDecRemoveOptions {
  className: string;
  id: string;
}

export interface ClassDecRemoveTreeOptions extends ClassDecRemoveOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const removeBeforeClassDecl = (opts: AnyOpts) => (node: Node) => {
  const { id, className } = opts;
  const decorator = findClassDecorator(node, {
    classId: className,
    id,
  });
  if (!decorator) {
    return;
  }
  const startPos = decorator.getStart();
  const endPos = decorator.getEnd();
  return removeCode(node, { startPos, endPos });
};

export function removeClassDecoratorInFile(
  filePath: string,
  opts: ClassDecRemoveOptions,
) {
  const findNodeFn = (node: SourceFile) => findClassDeclaration(node, opts.id);

  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: removeBeforeClassDecl,
    ...opts,
  });
}

export function removeClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecRemoveTreeOptions,
) {
  return modifyTree(tree, opts);
}
