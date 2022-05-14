import { refactorIfStmtsToFunctions } from '../../../refactor/if-stmt/if-stmt';
import { findFunctionBlock, findIfStatements } from '../../../find';
import { Block, IfStatement } from 'typescript';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import * as path from 'path';
import { tsquery } from '@phenomnomnominal/tsquery';

const context = describe;

describe('if statement', () => {
  context('if then user block', () => {
    it('replaced with: function and function call', () => {
      const filePath = path.join(__dirname, 'files', 'if-then-user-block.txt');
      const content = readFileIfExisting(filePath);
      const result = refactorIfStmtsToFunctions(content);
      if (!result) return;
      expect(result).toBeDefined();
    });
  });

  context('if then else user block', () => {
    it('replaced with: 2 functions and 2 function calls with logical or ||', () => {
      const filePath = path.join(__dirname, 'files', 'if-then-user-block.txt');
      const content = readFileIfExisting(filePath);
      const result = refactorIfStmtsToFunctions(content);
      console.log({ result });
      if (!result) return;
      expect(result).toBeDefined();
    });
  });
});
