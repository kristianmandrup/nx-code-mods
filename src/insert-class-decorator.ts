import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findClassDeclaration } from './find';

export interface ClassDecInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
}

export const insertBeforeClassDecl = (
  node: any,
  className: string,
  codeToInsert: string,
) => {
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const classDeclIndex = classDecl.getStart();
  return insertCode(node, classDeclIndex, codeToInsert);
};

export function insertClassDecorator(
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    className,
    codeToInsert,
  }: ClassDecInsertOptions,
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  if (targetFile !== '') {
    const ast = tsquery.ast(targetFile);
    const newContents = insertBeforeClassDecl(ast, className, codeToInsert);

    if (newContents !== targetFile && newContents) {
      tree.write(targetFilePath, newContents);
    }
  }
}
