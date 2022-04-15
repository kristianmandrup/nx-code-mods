import { appendAfterImportsInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('appendAfterImports', () => {
  context('file with imports', () => {
    it('appends import after last import statement', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const codeToInsert = `import { x } from 'x';`;
      const code = appendAfterImportsInFile(filePath, {
        codeToInsert,
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my';`;
      expect(modifiedCode.match(codeToInsert)).toBeTruthy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });

  context('file with no imports', () => {
    it('appends import at top of file', () => {
      const filePath = path.join(__dirname, 'files', 'no-imports.txt');
      const codeToInsert = `import { x } from 'x';`;
      const code = appendAfterImportsInFile(filePath, {
        codeToInsert,
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.match(codeToInsert)).toBeTruthy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });
});
