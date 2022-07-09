import { findIdentifier } from '../../find';
import { insertIntoNamedObjectInFile } from '../..';
import * as path from 'path';
import { Node } from 'typescript';

const context = describe;

describe('insert object', () => {
  context('file with no named object', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-object.txt');
      const code = insertIntoNamedObjectInFile(filePath, {
        code: `c: 3`,
        varId: 'myNamedObj',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(`c: 3`)).toBeFalsy();
    });
  });

  context('file with non-matching named object', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-object.txt',
      );
      const code = insertIntoNamedObjectInFile(filePath, {
        code: `c: 3`,
        varId: 'myNamedObj',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const anotherObj = {a: 1,b: 2}`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      expect(modifiedCode.includes(`c: 3`)).toBeFalsy();
    });
  });

  context('file with named empty object', () => {
    it('inserts in object', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-object.txt',
      );
      const code = insertIntoNamedObjectInFile(filePath, {
        code: `c: 3`,
        varId: 'myNamedObj',
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`c: 3`)).toBeTruthy();
    });
  });

  context('file with named object with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-props.txt',
        );
        const code = insertIntoNamedObjectInFile(filePath, {
          code: `c: 3`,
          varId: 'myNamedObj',
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`c: 3\\s*,\\s*a: 1,`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at middle of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-props.txt',
        );
        const code = insertIntoNamedObjectInFile(filePath, {
          code: `c: 3`,
          varId: 'myNamedObj',
          insert: {
            index: 1,
          },
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`c: 3\\s*,\\s*b: 2`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context('end pos', () => {
      it('inserts at end of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-props.txt',
        );
        const code = insertIntoNamedObjectInFile(filePath, {
          code: `c: 3`,
          varId: 'myNamedObj',
          insert: {
            index: 'end',
          },
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`b: 2\\s*,\\s*c: 3`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context(`findElement function`, () => {
      it('inserts after b identifier', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-props.txt',
        );
        const code = insertIntoNamedObjectInFile(filePath, {
          code: `c: 3`,
          varId: 'myNamedObj',
          insert: {
            relative: 'after',
            findElement: (node: Node) => findIdentifier(node, 'b'),
          },
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`\\s*b: 2\\s*,\\s*c: 3`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });

    context(`findElement 'b'`, () => {
      it('inserts after b identifier', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-2-props.txt',
        );
        const code = insertIntoNamedObjectInFile(filePath, {
          code: `c: 3`,
          varId: 'myNamedObj',
          insert: {
            relative: 'after',
            findElement: 'b',
          },
        });
        const modifiedCode = code ? code : '';
        const regExp = new RegExp(`\\s*b: 2\\s*,\\s*c: 3`);
        expect(modifiedCode.match(regExp)).toBeTruthy();
      });
    });
  });
});
