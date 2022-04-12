import { removeFromNamedArrayInFile } from '../..';
import * as path from 'path';
import { findStringLiteral } from '../../find';
import { Node } from 'typescript';

const context = describe;

describe('insert array', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const codeToInsert = `'c'`;
      const inserted = removeFromNamedArrayInFile(filePath, {
        id: 'myNamedList',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
      expect(insertedTxt.includes(codeToInsert)).toBeFalsy();
    });
  });
});
