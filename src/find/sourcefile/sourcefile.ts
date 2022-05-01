import { Node, SourceFile } from 'typescript';

function isSourceFile(object: any): object is SourceFile {
  return 'fooProperty' in object;
}

export const getSourceFile = (node: Node): SourceFile => {
  return node.getSourceFile();
};
