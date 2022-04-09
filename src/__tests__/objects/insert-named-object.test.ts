import { findStringLiteral } from './../../find';
import { insertIntoNamedObjectInFile } from '../..';
import * as path from 'path';
import { Node } from 'typescript';

const context = describe;

describe('insert object', () => {
  context('file with no named object', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-object.txt');
      const codeToInsert = `c: 3`;
      const inserted = insertIntoNamedObjectInFile(filePath, {
        codeToInsert,
        id: 'myNamedObj',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = 'const x = 2;';
      expect(insertedTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file with non-matching named object', () => {
    it('no insert', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-object.txt',
      );
      const codeToInsert = `c: 3`;
      const inserted = insertIntoNamedObjectInFile(filePath, {
        codeToInsert,
        id: 'myNamedObj',
      });
      const insertedTxt = inserted ? inserted : '';
      const origCode = `const anotherObj = {a: 1,b: 2}`;
      expect(insertedTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named empty object', () => {
    it('inserts in object', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-object.txt',
      );
      const codeToInsert = `c: 3`;
      const inserted = insertIntoNamedObjectInFile(filePath, {
        codeToInsert,
        id: 'myNamedObj',
      });
      const insertedTxt = inserted ? inserted : '';
      expect(insertedTxt.includes(`const myNamedObj = {c: 3}`)).toBeTruthy();
    });
  });

  context('file with named object with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-props.txt',
        );
        const codeToInsert = `c: 3`;
        const inserted = insertIntoNamedObjectInFile(filePath, {
          codeToInsert,
          id: 'myNamedObj',
        });
        const insertedTxt = inserted ? inserted : '';
        expect(insertedTxt.includes(`c: 3,a: 1,`)).toBeTruthy();
      });
    });

    context('numeric pos 1', () => {
      it('inserts at middle of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-props.txt',
        );
        const codeToInsert = `c: 3`;
        const inserted = insertIntoNamedObjectInFile(filePath, {
          codeToInsert,
          id: 'myNamedObj',
          insert: {
            index: 1,
          },
        });
        const insertedTxt = inserted ? inserted : '';
        expect(insertedTxt.includes(`c: 3,b: 2`)).toBeTruthy();
      });
    });

    context('end pos', () => {
      it('inserts at end of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-props.txt',
        );
        const codeToInsert = `c: 3`;
        const inserted = insertIntoNamedObjectInFile(filePath, {
          codeToInsert,
          id: 'myNamedObj',
          insert: {
            index: 'end',
          },
        });
        const insertedTxt = inserted ? inserted : '';
        expect(insertedTxt.includes(`b: 2,c: 3`)).toBeTruthy();
      });
    });

    context('after b string literal', () => {
      it('inserts after b string literal', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-props.txt',
        );

        const codeToInsert = `c: 3`;
        const inserted = insertIntoNamedObjectInFile(filePath, {
          codeToInsert,
          id: 'myNamedObj',
          insert: {
            relative: 'before',
            findElement: (node: Node) => findStringLiteral(node, 'b'),
          },
        });
        const insertedTxt = inserted ? inserted : '';
        expect(insertedTxt.includes(`b: 2,c: 3`)).toBeTruthy();
      });
    });
  });
});
