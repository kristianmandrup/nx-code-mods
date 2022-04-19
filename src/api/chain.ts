import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { removeApi, RemoveApi } from '../remove';
import { insertApi, InsertApi } from '../insert';
import { replaceApi, ReplaceApi } from '../replace';
import { AnyOpts } from '../modify';

export const chainApiFromFile = (filePath: string) => {
  return chainApi().readFile(filePath);
};

export const chainApi = (source: string = '') => {
  return new ChainApi(source);
};

export interface Chainable {
  source: string;
  defaultOpts?: AnyOpts;
}

export class ChainApi implements Chainable {
  defaultOpts = {};

  constructor(public source: string) {}

  readFile(filePath: string): ChainApi {
    const source = readFileIfExisting(filePath);
    return this.setSource(source);
  }

  setDefaultOpts(opts: AnyOpts = {}) {
    this.defaultOpts = opts;
    return this;
  }

  setSource(source: string) {
    this.source = source;
    return this;
  }

  get insert(): InsertApi {
    return insertApi(this);
  }

  get remove(): RemoveApi {
    return removeApi(this);
  }

  get replace(): ReplaceApi {
    return replaceApi(this);
  }
}
