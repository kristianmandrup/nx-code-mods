import { removeImportIdInFile } from '../..';
import { escapeRegExp } from '../../utils';
import * as path from 'path';

const context = describe;

describe('insertImport', () => {
  context('file with imports', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'has-imports.txt');
      const code = removeImportIdInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y } from './my';`;
      expect(modifiedCode.match(code)).toBeFalsy();
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });

  context('file with x import from other file', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-x-import-from-other-file.txt',
      );
      const code = removeImportIdInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { y, x } from './other-file';`;
      expect(modifiedCode.match(origCode)).toBeTruthy();
    });
  });

  context('file with x import from file', () => {
    it('removes x import', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-x-import-from-file.txt',
      );
      const code = removeImportIdInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { x, y } from './my-file';`;
      expect(modifiedCode.match(origCode)).toBeFalsy();

      const str = escapeRegExp(`{ y }`);
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file with no x import from file', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-x-import-from-file.txt',
      );
      const code = removeImportIdInFile(filePath, {
        importId: 'x',
        importFileRef: './my-file',
      });
      const modifiedCode = code ? code : '';
      const origCode = `import { x, y } from './my-file';`;
      expect(modifiedCode.match(origCode)).toBeFalsy();

      const str = escapeRegExp(`{ y }`);
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeFalsy();
    });
  });
});
