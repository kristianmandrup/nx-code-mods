import { findFunctionBlock, findReferenceIdentifiersFor } from '../../../find';
import { Block } from 'typescript';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';
import { blockName } from '../../../auto-name';
import { findBlock } from '../../../find/block';
import { idsToSrc } from '../../../refactor/utils';

const context = describe;

describe('extract method', () => {
  context('function blocks', () => {
    it('replaced with: functions and function calls', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'extract-method.txt',
      );
      console.log({ filePath });
      const content = readFileIfExisting(filePath);
      const srcNode = tsquery.ast(content);
      const block = findFunctionBlock(srcNode, 'xyz') as Block;
      let code = block.getText();
      code = code.substring(1, code.length - 1);
      console.log(code);
      const blocks = code.split(/\n\n/);

      function wrapBlock(src: string) {
        return '{' + src + '}';
      }

      function blockDetailsFor(block: string) {
        const src = tsquery.ast(wrapBlock(block));
        const $ids = findReferenceIdentifiersFor(src);
        const ids = idsToSrc($ids);
        console.log({ ids });
        const firstBlock = findBlock(src);
        if (!firstBlock) return {};
        const name = blockName(firstBlock as Block);
        return { name, params: ids };
      }

      const callFnTemplate = ({ name, params }: any) => `${name}({${params}})`;

      const fnTemplate = ({
        name,
        params,
        block,
      }: any) => `function ${name}({${params}}) {
        ${block}
      }`;

      for (let block of blocks) {
        const details = blockDetailsFor(block);
        const fnCode = fnTemplate({ ...details, block });
        const callCode = callFnTemplate(details);
        console.log({ fnCode, callCode });
      }
      expect(code).toBeDefined();
    });
  });
});
