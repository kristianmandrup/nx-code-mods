import { insertBeforeFirstMethod } from './insert-class-method';
import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  findClassDeclaration,
  findFirstMethodDeclaration,
  findMethodDeclaration,
} from './find';

export interface ClassMethodDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  methodId: string;
  codeToInsert: string;
}

export const insertBeforeMatchingMethod = (
  node: any,
  className: string,
  methodId: string,
  codeToInsert: string,
) => {
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, methodId);
  if (!methodDecl) return;
  const methodDeclIndex = methodDecl.getStart();
  return insertCode(node, methodDeclIndex, codeToInsert);
};

export function insertClassMethodDecorator(
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    className,
    methodId,
    codeToInsert,
  }: ClassMethodDecInsertOptions,
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  if (targetFile !== '') {
    const ast = tsquery.ast(targetFile);
    const newContents = insertBeforeMatchingMethod(
      ast,
      className,
      methodId,
      codeToInsert,
    );

    if (newContents !== targetFile && newContents) {
      tree.write(targetFilePath, newContents);
    }
  }
}
