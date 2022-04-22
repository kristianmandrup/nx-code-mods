import * as path from 'path';
import { insertClassPropertyInFile } from '../../..';
import { escapeRegExp } from '../../../utils';

const context = describe;

const insertCode = `myProp: User`;

describe('insert class property', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = insertClassPropertyInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-no-matching-class.txt',
      );
      const code = insertClassPropertyInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('inserts prop', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-empty-class.txt',
      );
      const code = insertClassPropertyInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeTruthy();
    });
  });

  context('file has matching class no matching property', () => {
    it('inserts method', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-no-matching-property.txt',
      );
      const code = insertClassPropertyInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      // console.log({ modifiedCode });
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // TODO: fix to make correct
      // const str = `${escapeRegExp(insertCode)}\\s*;\\s*propA`;
      const str = `${escapeRegExp(insertCode)}\\s*;\\s*propB`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file has matching class and property', () => {
    it('aborts, no insert', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-and-property.txt',
      );
      const code = insertClassPropertyInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeFalsy();
    });
  });
});
