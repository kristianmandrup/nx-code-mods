import { removeImportInFile } from '../..';
import * as path from 'path';

const context = describe;

describe('remove import', () => {
  context('file with imports', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const code = removeImportInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my';`;
      expect(modifiedCode.match('x')).toBeFalsy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });

  context('file with x import from file', () => {
    it('removes import', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-x-import-from-file.txt',
      );
      const code = removeImportInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { x, y } from './my-file';`;
      expect(modifiedCode.match(origCode)).toBeFalsy();
    });
  });
});
