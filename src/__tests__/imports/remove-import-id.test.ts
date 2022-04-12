import { removeImportIdInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('insertImport', () => {
  context('file with imports', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const codeToInsert = `x`;
      const inserted = removeImportIdInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = `import { y } from './my';`;
      expect(insertedTxt.match(codeToInsert)).toBeFalsy();
      expect(insertedTxt.match(origCode)).toBeTruthy();
    });
  });
});
