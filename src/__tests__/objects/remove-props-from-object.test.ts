import { removeFromNamedObjectInFile } from '../..';
import * as path from 'path';
import { findIdentifier } from '../../find/find';
import { Node } from 'typescript';

const context = describe;

describe('remove from object', () => {
  context('file with no named object', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'no-object.txt');
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with non-matching named object', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-non-matching-object.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const anotherObj = {a: 1,b: 2}`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named empty object', () => {
    it('no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-empty-object.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const modifiedCode = code ? code : '';
      const origCode = `const myNamedObj = {}`;
      expect(modifiedCode.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named object with 2 elements', () => {
    context('remove from default pos', () => {
      it('removes first prop of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-props.txt',
        );
        const code = removeFromNamedObjectInFile(filePath, {
          id: 'myNamedObj',
        });
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`a: 1`)).toBeFalsy();
        expect(modifiedCode.includes(`b: 2`)).toBeTruthy();
      });
    });
  });

  context('numeric pos 1', () => {
    it('removes element at pos 1', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-object-with-props.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
        remove: {
          index: 1,
          // default before
        },
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`a: 1`)).toBeFalsy();
      expect(modifiedCode.includes(`b: 2`)).toBeTruthy();
    });
  });

  context('last pos', () => {
    it('removes last prop of object', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-object-with-props.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
        remove: {
          index: 'last',
        },
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`a: 1`)).toBeTruthy();
      expect(modifiedCode.includes(`b: 2`)).toBeFalsy();
    });
  });

  context(`findElement function`, () => {
    it('removes after b identifier - no remove', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-object-with-props.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
        remove: {
          relative: 'after',
          findElement: (node: Node) => findIdentifier(node, 'b'),
        },
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`a: 1`)).toBeTruthy();
      expect(modifiedCode.includes(`b: 2`)).toBeTruthy();
    });
  });

  context(`findElement function`, () => {
    it('removes before b identifier', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-object-with-props.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
        remove: {
          relative: 'before',
          findElement: (node: Node) => findIdentifier(node, 'b'),
        },
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`a: 1`)).toBeFalsy();
      expect(modifiedCode.includes(`b: 2`)).toBeTruthy();
    });
  });

  context(`findElement 'a'`, () => {
    it('removes after a identifier', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-object-with-props.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
        remove: {
          relative: 'after',
          findElement: 'a',
        },
      });
      const modifiedCode = code ? code : '';
      expect(modifiedCode.includes(`a: 1`)).toBeTruthy();
      expect(modifiedCode.includes(`b: 2`)).toBeFalsy();
    });
  });
});
