import { insertImportInFile } from '../..';
import * as path from 'path';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insertImport', () => {
  context('file with imports', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const code = insertImportInFile(filePath, {
        code: `x`,
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my';`;
      expect(modifiedCode.match(`x`)).toBeFalsy();
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
      const code = insertImportInFile(filePath, {
        code: `x`,
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y, x } from './other-file';`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with x import from file', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-x-import-from-file.txt',
      );
      const code = insertImportInFile(filePath, {
        code: `x`,
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
      const code = insertImportInFile(filePath, {
        code: `a`,
        importId: 'a',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my-file';`;
      const str = `import {\\s*a\\s*,\\s*y\\s*`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.match(`a`)).toBeTruthy();
      expect(modifiedCode.match(origCode)).toBeFalsy();
    });
  });

  context('file with no imports', () => {
    it('insert import at top of file', () => {
      const filePath = path.join(__dirname, 'files', 'no-imports.txt');
      const code = insertImportInFile(filePath, {
        code: `y`,
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.match(`y`)).toBeFalsy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });
});
