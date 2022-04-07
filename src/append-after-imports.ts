import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { findLastImport } from './find';

export interface InsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
  codeToInsert: string;
}

export const insertAfterLastImport = (
  node: any,
  codeToInsert: string,
): string | undefined => {
  const lastImportStmt = findLastImport(node);
  if (!lastImportStmt) return;
  const lastImportIndex = lastImportStmt.getEnd();
  return insertCode(node, lastImportIndex, codeToInsert);
};

export function appendAfterImports(
  tree: Tree,
  { projectRoot, relTargetFilePath, codeToInsert }: InsertOptions,
) {
  const targetFilePath = path.join(projectRoot, relTargetFilePath);
  const targetFile = readFileIfExisting(targetFilePath);

  if (targetFile !== '') {
    const ast = tsquery.ast(targetFile);
    const newContents = insertAfterLastImport(ast, codeToInsert);
    if (newContents !== targetFile && newContents) {
      tree.write(targetFilePath, newContents);
    }
  }
}
