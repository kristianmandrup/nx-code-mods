import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findClassDeclaration, findFirstMethodDeclaration } from './find';

export interface ClassMethodInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
}

export const insertBeforeFirstMethod = (
  node: any,
  className: string,
  codeToInsert: string,
) => {
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const methodDecl = findFirstMethodDeclaration(classDecl);
  if (!methodDecl) return;
  const methodDeclIndex = methodDecl.getStart();
  return insertCode(node, methodDeclIndex, codeToInsert);
};

export function insertClassMethod(
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    className,
    codeToInsert,
  }: ClassMethodInsertOptions,
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  if (targetFile !== '') {
    const ast = tsquery.ast(targetFile);
    const newContents = insertBeforeFirstMethod(ast, className, codeToInsert);

    if (newContents !== targetFile && newContents) {
      tree.write(targetFilePath, newContents);
    }
  }
}
