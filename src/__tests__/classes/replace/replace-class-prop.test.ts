import * as path from 'path';
import { replaceClassPropertyInFile } from '../../..';
import { escapeRegExp } from '../../../utils';

const context = describe;

describe('replace class property', () => {
  context('file has no class', () => {
    it('no replace', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = replaceClassPropertyInFile(filePath, {
        code: `myProp: User`,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has no matching class', () => {
    it('no replace', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-no-matching-class.txt',
      );
      const code = replaceClassPropertyInFile(filePath, {
        code: `myProp: User`,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching empty class', () => {
    it('replaces prop', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-empty-class.txt',
      );
      const code = replaceClassPropertyInFile(filePath, {
        code: `myProp: User`,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class no matching property', () => {
    it('no replace', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-no-matching-property.txt',
      );
      const code = replaceClassPropertyInFile(filePath, {
        code: `myProp: User`,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // const str = `${escapeRegExp(codeToRemove)}\\s*;\\s*propA`;
      // const regExp = new RegExp(str);
      // expect(modifiedCode.match(regExp)).toBeTruthy();
    });
  });

  context('file has matching class and property', () => {
    it('replaces prop', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-and-property.txt',
      );
      const code = replaceClassPropertyInFile(filePath, {
        code: `myProp: User`,
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
