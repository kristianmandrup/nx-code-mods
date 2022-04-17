import { removeImportInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('insertImport', () => {
  context('file with imports', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const code = removeImportInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my';`;
      expect(modifiedCode.match(code)).toBeFalsy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });
});
