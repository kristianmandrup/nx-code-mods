import * as path from 'path';
import { insertClassMethodParameterInFile } from '../../../';
import { escapeRegExp } from '../../../utils';

const context = describe;
const insertCode = `body: string`;

describe('insert class method param decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, '..', 'files', 'no-class.txt');
      const code = insertClassMethodParameterInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'body',
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
      const code = insertClassMethodParameterInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-empty-class.txt',
      );
      const code = insertClassMethodParameterInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it('insert param in class method at position 1', () => {
      const filePath = path.join(
        __dirname,
        '..',
        'files',
        'has-matching-class-and-method.txt',
      );
      const code = insertClassMethodParameterInFile(filePath, {
        code: insertCode,
        classId: 'myClass',
        methodId: 'myMethod',
        paramId: 'body',
        insert: {
          index: 1,
        },
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      const str = `${escapeRegExp('myMethod(' + insertCode)}`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.includes(insertCode)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method and 2 params', () => {
    const filePath = path.join(
      __dirname,
      '..',
      'files',
      'has-matching-class-and-method.txt',
    );

    context('index 1', () => {
      it('insert param in class method at position 1, between params', () => {
        const code = insertClassMethodParameterInFile(filePath, {
          code: insertCode,
          classId: 'myClass',
          methodId: 'myMethod',
          paramId: 'body',
          insert: {
            index: 1,
          },
        });
        const modifiedCode = code ? code : '';
        const origCode = 'const x = 2;';
        const str = `${escapeRegExp('myMethod(' + insertCode)}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.match(regExp)).toBeTruthy();
        expect(modifiedCode.includes(insertCode)).toBeTruthy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
      });
    });

    context('index first', () => {
      it('insert param in class method at first param position', () => {
        const filePath = path.join(
          __dirname,
          '..',
          'files',
          'has-matching-class-and-method.txt',
        );
        const code = insertClassMethodParameterInFile(filePath, {
          code: insertCode,
          classId: 'myClass',
          methodId: 'myMethod',
          paramId: 'body',
          insert: {
            index: 'start',
          },
        });
        const modifiedCode = code ? code : '';
        const origCode = 'const x = 2;';
        const str = `${escapeRegExp('myMethod(' + insertCode)}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.match(regExp)).toBeTruthy();
        expect(modifiedCode.includes(insertCode)).toBeTruthy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
      });
    });

    context('index last', () => {
      it('insert param in class method at last param position', () => {
        const filePath = path.join(
          __dirname,
          '..',
          'files',
          'has-matching-class-and-method.txt',
        );
        const code = insertClassMethodParameterInFile(filePath, {
          code: insertCode,
          classId: 'myClass',
          methodId: 'myMethod',
          paramId: 'body',
          insert: {
            index: 'end',
          },
        });
        const modifiedCode = code ? code : '';
        const origCode = 'const x = 2;';
        const str = `${escapeRegExp('myMethod(' + insertCode)}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.match(regExp)).toBeTruthy();
        expect(modifiedCode.includes(insertCode)).toBeTruthy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
      });
    });
  });
});
