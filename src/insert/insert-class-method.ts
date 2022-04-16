import { ensureStmtClosing } from '../ensure';
import { insertCode, AnyOpts, replaceInFile, modifyTree } from '../modify';
import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findFirstMethodDeclaration,
  findLastPropertyDeclaration,
  findMethodDeclaration,
} from '../find';
import { Node, SourceFile } from 'typescript';

export interface ClassMethodInsertOptions {
  classId: string;
  methodId: string;
  codeToInsert: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
}

export interface ClassMethodInsertTreeOptions extends ClassMethodInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const insertInMethodBlock = (opts: AnyOpts) => (node: any) => {
  const { classId, codeToInsert, insertPos, indexAdj } = opts;
  const abortIfFound = (node: Node) =>
    findMethodDeclaration(node, opts.methodId);

  const classDecl = findClassDeclaration(node, classId);
  if (!classDecl) return;

  // abort insert of method if method already declared in class
  if (abortIfFound) {
    const found = abortIfFound(classDecl);
    if (found) {
      return;
    }
  }

  let insertIndex;

  if (insertPos === 'end') {
    insertIndex = classDecl.getEnd() - 1;
  } else {
    const firstMethodDecl = findFirstMethodDeclaration(classDecl);
    if (!firstMethodDecl) {
      const { members } = classDecl;
      if (members.length === 0) {
        insertIndex = classDecl.getEnd() - 1;
      } else {
        const lastPropDecl = findLastPropertyDeclaration(classDecl);
        if (!lastPropDecl) {
          insertIndex = classDecl.getEnd() - 1;
          return;
        }
        insertIndex = lastPropDecl.getEnd();
      }
    } else {
      insertIndex = firstMethodDecl.getStart();
    }
  }
  insertIndex += indexAdj || 0;
  const code = ensureStmtClosing(codeToInsert);
  return insertCode(node, insertIndex, code);
};

export function insertClassMethodInFile(
  filePath: string,
  opts: ClassMethodInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.classId);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertInMethodBlock,
    ...opts,
  });
}

export async function insertClassMethodInTree(
  tree: Tree,
  opts: ClassMethodInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
