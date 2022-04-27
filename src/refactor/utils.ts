import { Identifier } from 'typescript';

export const mapIdentifiersToTxtList = (ids: Identifier[]): string[] =>
  ids.map((id) => id.escapedText as string);

export const mapIdentifiersToSrc = (ids: Identifier[]) => {
  return mapIdentifiersToTxtList(ids).join(',');
};
