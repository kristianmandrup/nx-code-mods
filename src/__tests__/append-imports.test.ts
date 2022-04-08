import { appendAfterImportsInFile } from '..';
import * as path from 'path';

const context = describe;

describe('appendAfterImports', () => {
  context('file with imports', () => {
    it('appends import after last import statement', () => {
      const filePath = path.join(__dirname, 'files', 'imports.txt');
      const codeToInsert = `import { x } from 'x';`;
      const inserted = appendAfterImportsInFile(filePath, {
        codeToInsert,
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = `import { y } from 'y';`;
      expect(insertedTxt.match(codeToInsert)).toBeTruthy();
      expect(insertedTxt.match(origCode)).toBeTruthy();
    });
  });

  context('file with no imports', () => {
    it('appends import at top of file', () => {
      const filePath = path.join(__dirname, 'files', 'no-imports.txt');
      const codeToInsert = `import { x } from 'x';`;
      const inserted = appendAfterImportsInFile(filePath, {
        codeToInsert,
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.match(codeToInsert)).toBeTruthy();
      expect(insertedTxt.match(origCode)).toBeTruthy();
    });
  });
});
