import * as path from 'path';
import { insertClassMethodParamDecoratorInFile } from '../../';
import { escapeRegExp } from '../../utils';

const context = describe;

describe('insert class method param decorator', () => {
  context('file has no class', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-class.txt');
      const codeToInsert = `body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has no matching class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-no-matching-class.txt',
      );
      const codeToInsert = `body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        id: 'Body',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeFalsy();
    });
  });

  context('file has matching empty class', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-class.txt',
      );
      const codeToInsert = `body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method', () => {
    it.skip('insert param in class method at position 1', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-class-and-method.txt',
      );
      const codeToInsert = `body: string`;
      const code = insertClassMethodParamDecoratorInFile(filePath, {
        codeToInsert,
        className: 'myClass',
        methodId: 'myMethod',
        insert: {
          index: 1,
        },
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      const str = `${escapeRegExp('myMethod(' + codeToInsert)}`;
      const regExp = new RegExp(str);
      expect(modifiedCode.match(regExp)).toBeTruthy();
      expect(modifiedCode.includes(codeToInsert)).toBeTruthy();
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file has matching class and method and 2 params', () => {
    const filePath = path.join(
      __dirname,
      'files',
      'has-matching-class-and-method.txt',
    );

    context('index 1', () => {
      const codeToInsert = `body: string`;

      it('insert param in class method at position 1, between params', () => {
        const code = insertClassMethodParamDecoratorInFile(filePath, {
          codeToInsert,
          className: 'myClass',
          methodId: 'myMethod',
          insert: {
            index: 1,
          },
        });
        const modifiedCode = code ? code : '';
        const origCode = 'const x = 2;';
        const str = `${escapeRegExp('myMethod(' + codeToInsert)}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.match(regExp)).toBeTruthy();
        expect(modifiedCode.includes(codeToInsert)).toBeTruthy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
      });
    });

    context('index first', () => {
      it.skip('insert param in class method at first param position', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-class-and-method.txt',
        );
        const codeToInsert = `body: string`;
        const code = insertClassMethodParamDecoratorInFile(filePath, {
          codeToInsert,
          className: 'myClass',
          methodId: 'myMethod',
          insert: {
            index: 'first',
          },
        });
        const modifiedCode = code ? code : '';
        const origCode = 'const x = 2;';
        const str = `${escapeRegExp('myMethod(' + codeToInsert)}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.match(regExp)).toBeTruthy();
        expect(modifiedCode.includes(codeToInsert)).toBeTruthy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
      });
    });

    context('index last', () => {
      it.skip('insert param in class method at last param position', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-class-and-method.txt',
        );
        const codeToInsert = `body: string`;
        const code = insertClassMethodParamDecoratorInFile(filePath, {
          codeToInsert,
          className: 'myClass',
          methodId: 'myMethod',
          insert: {
            index: 'last',
          },
        });
        const modifiedCode = code ? code : '';
        const origCode = 'const x = 2;';
        const str = `${escapeRegExp('myMethod(' + codeToInsert)}`;
        const regExp = new RegExp(str);
        expect(modifiedCode.match(regExp)).toBeTruthy();
        expect(modifiedCode.includes(codeToInsert)).toBeTruthy();
        expect(modifiedCode.includes(origCode)).toBeTruthy();
      });
    });
  });
});
