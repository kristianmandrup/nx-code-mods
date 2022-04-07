import { insertCode } from './insert-code';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { Tree } from "@nrwl/devkit";
import { tsquery } from '@phenomnomnominal/tsquery';
import { ImportDeclaration } from 'typescript';

export interface AppendImportOptions { 
    projectRoot: string
    relTargetFilePath: string
    codeToInsert: string
}


export const findLastImportIndex = (txtNode: any) => {
    const lastImport = tsquery(txtNode, 'ImportDeclaration:last-child') 
    if (!lastImport) return
    return (lastImport[0] as ImportDeclaration).getEnd()
}

export function appendImport(
    tree: Tree,
    { projectRoot, relTargetFilePath, codeToInsert }: AppendImportOptions
  ) {
    const targetFilePath = path.join(projectRoot, relTargetFilePath);
    const targetFile = readFileIfExisting(targetFilePath);
  
    const insertFn = (node: any) => {
      let txtNode = node.getFullText();
      const lastImportIndex = findLastImportIndex(txtNode);
      if (!lastImportIndex) return
      return insertCode(txtNode, lastImportIndex, codeToInsert)
    };
  
    if (targetFile !== '') {
        const ast = tsquery.ast(targetFile)
        const newContents = insertFn(ast)
  
      if (newContents !== targetFile && newContents) {
        tree.write(targetFilePath, newContents);
      }
    }
  }