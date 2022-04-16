import {
  CollectionRemove,
  RemoveIndexAdj,
  removeFromNamedObjectInSource,
  removeFromNamedObjectInFile,
} from '../remove';
export interface ReplaceObjectOptions {
  id: string;
  replacementCode: string;
  remove?: CollectionRemove;
  indexAdj?: RemoveIndexAdj;
}

export interface ReplaceObjectTreeOptions extends ReplaceObjectOptions {
  projectRoot: string;
  relTargetFilePath: string;
}

export function replaceInNamedObjectInSource(
  sourceCode: string,
  opts: ReplaceObjectOptions,
) {
  return removeFromNamedObjectInSource(sourceCode, opts);
}

export function replaceInNamedObjectInFile(
  targetFilePath: string,
  opts: ReplaceObjectOptions,
) {
  return removeFromNamedObjectInFile(targetFilePath, opts);
}
