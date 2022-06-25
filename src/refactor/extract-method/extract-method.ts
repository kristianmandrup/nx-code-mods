import { tsquery } from '@phenomnomnominal/tsquery';
import { Block, SourceFile } from 'typescript';
import { blockName } from '../../auto-name';
import { findReferenceIdentifiersFor } from '../../find';
import { findBlock } from '../../find/block';
import { replaceCode } from '../../modify';
import {
  insertExtractedFunction,
  replaceWithCallToExtractedFunction,
} from '../common';
import { idsToSrc } from '../utils';

const wrapBlock = (src: string) => {
  return '{' + src + '}';
};

export const blockDetailsFor = (block: string) => {
  const src = tsquery.ast(wrapBlock(block));
  const $ids = findReferenceIdentifiersFor(src);
  const ids = idsToSrc($ids);
  const firstBlock = findBlock(src);
  if (!firstBlock) return {};
  const name = blockName(firstBlock as Block);
  return { name, params: ids };
};

const callFnTemplate = ({ name, params }: any) => `${name}({${params}});\n`;

const fnTemplate = ({
  name,
  params,
  block,
}: any) => `\nfunction ${name}({${params}}) {
  ${block}
  }\n`;

export const extractMethods = (srcNode: SourceFile, block: Block) => {
  let code = block.getText();
  code = code.substring(1, code.length - 1);
  let blocks = code.split(/\n\n/);

  const functionDefs: string[] = [];
  const functionCalls: string[] = [];

  blocks.map((codeBlock) => {
    const details = blockDetailsFor(codeBlock);
    const functionDef = fnTemplate({ ...details, block: codeBlock });
    const functionCall = callFnTemplate(details);
    functionDefs.push(functionDef);
    functionCalls.push(functionCall);
  });
  const positions = {
    startPos: block.getStart() + 1,
    endPos: block.getEnd() - 1,
  };
  code = functionDefs.join('/n') + '\n' + functionCalls.join('/n');
  const opts = { ...positions, code };
  return replaceCode(srcNode, opts);
};
