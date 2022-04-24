import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { removeApi, RemoveApi } from '../remove';
import { insertApi, InsertApi } from '../insert';
import { replaceApi, ReplaceApi } from '../replace';
import { AnyOpts } from '../modify';
import { BaseApi, StoreOperation } from './base-api';

interface ChainDef {
  api: string;
  ops: StoreOperation[];
}

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
  validKeys = ['insert', 'remove', 'replace'];

  constructor(public source: string) {}

  readFile(filePath: string): ChainApi {
    const source = readFileIfExisting(filePath);
    return this.setSource(source);
  }

  apiByName(name: string) {
    return (this as any)[name] as BaseApi;
  }

  loadChain(chainDef: ChainDef[]) {
    chainDef.map((def) => {
      const name = def.api;
      const api = this.apiByName(name);
      const apiOps = def.ops;
      api.addOpsToStore(apiOps);
    });
  }

  applyStores(names: string[] = this.validKeys) {
    names.map((name) => this.applyStore(name));
    return this;
  }

  applyStore(name: string) {
    const api = this.apiByName(name);
    api.applyStore();
    return this;
  }

  isValidKey(key: string) {
    return this.validKeys.includes(key);
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
