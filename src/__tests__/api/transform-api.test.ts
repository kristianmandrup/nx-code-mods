import { chainApi, chainApiFromFile } from './../../api';
import * as path from 'path';
import { transformInSource } from '../../modify';
import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';

const context = describe;

const transformOpts = {
  format: true,
  transform: (source) => {
    const api = chainApi(source).setDefaultOpts({ classId: 'myClass' });
    const { insert } = api;
    insert
      .classDecorator({
        code: '@Model()',
      })
      .classMethodDecorator({
        code: '@Post()',
        methodId: 'myMethod',
      });
    return api.source;
  },
};

describe('chain api', () => {
  context('file with no named array', () => {
    it('no insert', () => {
      const filePath = path.join(__dirname, 'files', 'no-array.txt');
      const source = readFileIfExisting(filePath);
      const code = transformInSource(source, transformOpts);
      const modifiedCode = code ? code : '';
      const origCode = 'const x = 2;';
      expect(modifiedCode.includes(origCode)).toBeTruthy();
      // expect(modifiedCode.includes(code)).toBeFalsy();
    });
  });

  context('file with named array with 2 elements', () => {
    context('default pos', () => {
      it('inserts at start of array', () => {
        const filePath = path.join(
          __dirname,
          'files',
          'has-matching-array-with-2-elements.txt',
        );
        const source = readFileIfExisting(filePath);
        const code = transformInSource(source, transformOpts);
        const modifiedCode = code ? code : '';
        expect(modifiedCode.includes(`'c','a'`)).toBeTruthy();
      });
    });
  });
});
