import { appendAfterImportsInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('appendAfterImports', () => {
  context('file with imports', () => {
    it('appends import after last import statement', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const code = appendAfterImportsInFile(filePath, {
        code: `import { x } from 'x';`,
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my';`;
      expect(modifiedCode.includes(`import { x } from 'x';`)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with no imports', () => {
    it('appends import at top of file', () => {
      const filePath = path.join(__dirname, 'files', 'no-imports.txt');
      const code = appendAfterImportsInFile(filePath, {
        code: `import { x } from 'x';`,
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(`import { x } from 'x';`)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
