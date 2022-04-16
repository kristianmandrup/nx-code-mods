import { ensurePrefixComma, ensureSuffixComma } from '../ensure';
import {
  afterLastElementPos,
  aroundElementPos,
  CollectionInsert,
  getInsertPosNum,
} from './positional';
import {
  findClassDeclaration,
  findClassMethodDeclaration,
  findParameter,
} from '../find';
import { insertCode, replaceInFile, AnyOpts, modifyTree } from '../modify';
import { Node, SourceFile } from 'typescript';
import { Tree } from '@nrwl/devkit';
export interface ClassMethodDecParamInsertOptions {
  className: string;
  methodId: string;
  id: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}

export interface ClassMethodDecParamInsertTreeOptions
  extends ClassMethodDecParamInsertOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export const insertParamInMatchingMethod =
  (opts: AnyOpts) => (srcNode: Node) => {
    const { className, methodId, id, insert, codeToInsert, indexAdj } = opts;
    const methodDecl = findClassMethodDeclaration(srcNode, {
      classId: className,
      methodId,
    });
    if (!methodDecl) return;
    // abort if class decorator already present
    const abortIfFound = (node: Node) => findParameter(node, id);

    if (abortIfFound) {
      const found = abortIfFound(methodDecl);
      if (found) {
        return;
      }
    }
    const node = methodDecl;
    const elements = methodDecl.parameters;
    const count = elements.length;
    let insertPosNum =
      getInsertPosNum({
        node,
        elements,
        insert,
        count,
      }) || 0;
    if (count === 0) {
      let insertPosition = node.getStart() + 1;
      insertPosition += indexAdj || 0;
      const code = codeToInsert; // ensureSuffixComma(codeToInsert);
      return insertCode(srcNode, insertPosition, code);
    }
    if (insertPosNum === -1) {
      insertPosNum = 0;
      insert.relative = 'before';
    }

    let insertPosition =
      insertPosNum >= count
        ? afterLastElementPos(elements)
        : aroundElementPos(elements, insertPosNum, insert.relative);

    const shouldInsertAfter =
      insertPosNum === count || insert.relative === 'after';
    const code = shouldInsertAfter
      ? ensurePrefixComma(codeToInsert)
      : ensureSuffixComma(codeToInsert);

    insertPosition += indexAdj || 0;
    return insertCode(node, insertPosition, code);
  };

export function insertClassMethodParamInFile(
  filePath: string,
  opts: ClassMethodDecParamInsertOptions,
) {
  const findNodeFn = (node: SourceFile) =>
    findClassDeclaration(node, opts.className);
  return replaceInFile(filePath, {
    findNodeFn,
    modifyFn: insertParamInMatchingMethod,
    ...opts,
  });
}

export async function insertClassMethodParamInTree(
  tree: Tree,
  opts: ClassMethodDecParamInsertTreeOptions,
) {
  return await modifyTree(tree, opts);
}
