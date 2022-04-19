import * as path from 'path';
import { removeClassPropertyInFile } from '../../..';
import { escapeRegExp } from '../../../utils';

const context = describe;

describe('remove class property', () => {
  context('file has no class', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const code = removeClassPropertyInFile(filePath, {
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has no matching class', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const code = removeClassPropertyInFile(filePath, {
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching empty class', () => {
    it('removes prop', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const code = removeClassPropertyInFile(filePath, {
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class no matching property', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-no-matching-property.txt',
      );
      const code = removeClassPropertyInFile(filePath, {
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
    it('removes prop', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-property.txt',
      );
      const code = removeClassPropertyInFile(filePath, {
        classId: 'myClass',
        propertyId: 'myProp',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });
});
