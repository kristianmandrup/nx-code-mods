import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findBlock, findClassDeclaration } from './find';

export interface ClassPropInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  className: string;
  codeToInsert: string;
}

const insertAtTopOfClassScope = (
  node: any,
  className: string,
  codeToInsert: string,
) => {
  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  const block = findBlock(classDecl);
  if (!block) return;
  const blockIndex = block.getStart();
  return insertCode(node, blockIndex, codeToInsert);
};

export function insertClassProperty(
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    className,
    codeToInsert,
  }: ClassPropInsertOptions,
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  if (targetFile !== '') {
    const ast = tsquery.ast(targetFile);
    const newContents = insertAtTopOfClassScope(ast, className, codeToInsert);

    if (newContents !== targetFile && newContents) {
      tree.write(targetFilePath, newContents);
    }
  }
}
