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

export interface ClassMethodDecArgInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  methodId: string;
  codeToInsert: string;
}

export const insertArgInMatchingMethod = (
  node: any,
  className: string,
  methodId: string,
  codeToInsert: string,
) => {
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findMethodDeclaration(classDecl, methodId);
  if (!methodDecl) return;
  const parametersIndex = methodDecl.parameters.pos;
  return insertCode(node, parametersIndex, codeToInsert);
};

export function insertClassMethodArgDecorator(
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    methodId,
    className,
    codeToInsert,
  }: ClassMethodDecArgInsertOptions,
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  if (targetFile !== '') {
    const ast = tsquery.ast(targetFile);
    const newContents = insertArgInMatchingMethod(
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
