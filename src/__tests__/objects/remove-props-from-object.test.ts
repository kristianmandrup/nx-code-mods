import { removeFromNamedObjectInFile } from '../..';
import * as path from 'path';
import { findIdentifier } from '../../find';
import { Node } from 'typescript';

const context = describe;

describe('remove from object', () => {
  context('file with no named object', () => {
    it('no remove', () => {
      const filePath = path.join(__dirname, 'files', 'no-object.txt');
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
      });
      const codeTxt = code ? code : '';
      const origCode = 'const x = 2;';
      expect(codeTxt.includes(origCode)).toBeTruthy();
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
      const codeTxt = code ? code : '';
      const origCode = `const anotherObj = {a: 1,b: 2}`;
      expect(codeTxt.includes(origCode)).toBeTruthy();
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
      const codeTxt = code ? code : '';
      const origCode = `const myNamedObj = {}`;
      expect(codeTxt.includes(origCode)).toBeTruthy();
    });
  });

  context('file with named object with 2 elements', () => {
    context('remove from default pos', () => {
      it.skip('removes first prop of object', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-object-with-props.txt',
        );
        const code = removeFromNamedObjectInFile(filePath, {
          id: 'myNamedObj',
        });
        const codeTxt = code ? code : '';
        expect(codeTxt.includes(`a: 1,`)).toBeFalsy();
        expect(codeTxt.includes(`b: 1,`)).toBeTruthy();
      });
    });
  });

  context('numeric pos 1', () => {
    it.skip('removes element at pos 1', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-object-with-props.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
        remove: {
          index: 1,
        },
      });
      const codeTxt = code ? code : '';
      expect(codeTxt.includes(`a: 1`)).toBeTruthy();
      expect(codeTxt.includes(`b: 2`)).toBeFalsy();
    });
  });

  context('last pos', () => {
    it.skip('removes last prop of object', () => {
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
      const codeTxt = code ? code : '';
      expect(codeTxt.includes(`a: 1`)).toBeTruthy();
      expect(codeTxt.includes(`b: 2`)).toBeFalsy();
    });
  });

  context(`findElement function`, () => {
    it.skip('removes after b identifier', () => {
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
      const codeTxt = code ? code : '';
      expect(codeTxt.includes(`a: 1`)).toBeTruthy();
      expect(codeTxt.includes(`b: 2`)).toBeFalsy();
    });
  });

  context(`findElement 'b'`, () => {
    it.skip('removes after b identifier', () => {
      const filePath = path.join(
        __dirname,
        'files',
        'has-matching-object-with-props.txt',
      );
      const code = removeFromNamedObjectInFile(filePath, {
        id: 'myNamedObj',
        remove: {
          relative: 'after',
          findElement: 'b',
        },
      });
      const codeTxt = code ? code : '';
      expect(codeTxt.includes(`a: 1`)).toBeTruthy();
      expect(codeTxt.includes(`b: 2`)).toBeFalsy();
    });
  });
});
