import { insertImportInFile } from '../..';
import * as path from 'path';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insertImport', () => {
  context('file with imports', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const codeToInsert = `x`;
      const code = insertImportInFile(filePath, {
        codeToInsert,
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my';`;
      expect(modifiedCode.match(codeToInsert)).toBeFalsy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });

  context('file with x import from other file', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-x-import-from-other-file.txt',
      );
      const codeToInsert = `x`;
      const code = insertImportInFile(filePath, {
        codeToInsert,
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y, x } from './other-file';`;
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });

  context('file with x import from file', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-x-import-from-file.txt',
      );
      const codeToInsert = `x`;
      const code = insertImportInFile(filePath, {
        codeToInsert,
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { x, y } from './my-file';`;
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });

  context('file with no x import from file', () => {
    it('inserts a into import', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-x-import-from-file.txt',
      );
      const codeToInsert = `a`;
      const code = insertImportInFile(filePath, {
        codeToInsert,
        importId: 'a',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { x, y } from './my-file';`;
      const str = `${escapeRegExp(
        'import { ' + codeToInsert + ',x, y } from',
      )}`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.match(codeToInsert)).toBeTruthy();
      expect(modifiedCode.match(origCode)).toBeFalsy();
    });
  });

  context('file with no imports', () => {
    it('insert import at top of file', () => {
      const filePath = path.join(__dirname, 'files', 'no-imports.txt');
      const codeToInsert = `y`;
      const code = insertImportInFile(filePath, {
        codeToInsert,
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.match(codeToInsert)).toBeFalsy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });
});
