import { readFileIfExisting } from '@nrwl/workspace/src/core/file-utils';
import { removeApi, RemoveApi } from '../remove';
import { insertApi, InsertApi } from '../insert';
import { replaceApi, ReplaceApi } from '../replace';
import { AnyOpts, saveAndFormatTree, saveTree } from '../modify';
import { BaseApi, StoreOperation } from './base-api';
import { Tree } from '@nrwl/devkit';

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
  apiNames = ['insert', 'remove', 'replace'];
  tree?: Tree;

  constructor(public source: string) {}

  setTree(tree: Tree) {
    this.tree = tree;
    return this;
  }

  readFile(filePath: string): ChainApi {
    const source = readFileIfExisting(filePath);
    return this.setSource(source);
  }

  apiByName(name: string) {
    return (this as any)[name] as BaseApi;
  }

  async saveFile(
    filePath: string,
    { tree, format }: { tree?: Tree; format?: boolean },
  ) {
    tree = tree || this.tree;
    if (!tree) {
      throw new Error('No tree defined');
    }
    await saveAndFormatTree({
      tree,
      filePath,
      fileContent: this.source,
      format,
    });
  }

  loadChainFromFile(filePath: string) {
    const fileContent = readFileIfExisting(filePath);
    const json = JSON.parse(fileContent);
    this.loadChain(json);
    return this;
  }

  loadChain(chainDef: ChainDef[], reset?: boolean) {
    reset = reset === false ? false : true;
    chainDef.map((def) => {
      const name = def.api;
      const api = this.apiByName(name);
      const apiOps = def.ops;
      reset && api.resetStore();
      api.addOpsToStore(apiOps);
    });
    return this;
  }

  applyStores(names: string[] = this.apiNames) {
    names.map((name) => this.applyStore(name));
    return this;
  }

  resetStores(names: string[] = this.apiNames) {
    names.map((name) => this.resetStore(name));
    return this;
  }

  resetStore(name: string) {
    if (!this.isValidApiName(name)) {
      throw new Error(`Invalid api name ${name}`);
    }
    const api = this.apiByName(name);
    api.resetStore();
    return this;
  }

  applyStore(name: string) {
    if (!this.isValidApiName(name)) {
      throw new Error(`Invalid api name ${name}`);
    }
    const api = this.apiByName(name);
    api.applyStore();
    return this;
  }

  isValidApiName(name: string) {
    return this.apiNames.includes(name);
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
