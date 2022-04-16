import { Tree } from '@nrwl/devkit';
import {
  findClassDeclaration,
  findClassPropertyDeclaration,
  findFirstMethodDeclaration,
  findFirstPropertyDeclaration,
} from '../find';
import { insertCode, replaceInFile, AnyOpts, modifyTree } from '../modify';
import { Node, SourceFile } from 'typescript';
import { ensureStmtClosing } from '../ensure';

export interface ClassPropInsertOptions {
  className: string;
  propId: string;
  codeToInsert: string;
  insertPos?: InsertPosition;
  indexAdj?: number;
}

export interface ClassPropInsertTreeOptions extends ClassPropInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

const insertInClassScope = (opts: AnyOpts) => (node: Node) => {
  const { className, codeToInsert, insertPos, propId, indexAdj } = opts;

  const abortIfFound = (node: any) =>
    findClassPropertyDeclaration(node, { classId: className, propId });

  const classDecl = findClassDeclaration(node, className);
  if (!classDecl) return;
  // abort if property with that name already declared in class
  if (abortIfFound) {
    const found = abortIfFound(classDecl);
    if (found) return;
  }
  let insertIndex;
  if (insertPos === 'end') {
    insertIndex = classDecl.getEnd() - 1;
  } else {
    const firstPropDecl = findFirstPropertyDeclaration(classDecl);
    if (!firstPropDecl) {
      const { members } = classDecl;
      if (members.length === 0) {
        insertIndex = classDecl.getEnd() - 1;
      } else {
        const firstMethDecl = findFirstMethodDeclaration(classDecl);
        if (!firstMethDecl) {
          insertIndex = classDecl.getEnd() - 1;
          return;
        }
        insertIndex = firstMethDecl.getStart();
      }
    } else {
      insertIndex = firstPropDecl.getStart();
    }
  }
  insertIndex += indexAdj || 0;
  const code = ensureStmtClosing(codeToInsert);
  return insertCode(node, insertIndex, code);
};

export function insertClassPropertyInFile(
  filePath: string,
  opts: ClassPropInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertInClassScope,
    ...opts,
  });
}

export async function insertClassPropertyInTree(
  tree: Tree,
  opts: ClassPropInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
