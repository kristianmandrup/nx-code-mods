import { AnyOpts } from '../modify';
import { Chainable } from './chain';

export type ModifyApiFn = (src: string, opts: any) => string | undefined;

export interface StoreOperation {
  name: string;
  def: AnyOpts;
}

export class BaseApi implements Chainable {
  defaultOpts: AnyOpts = {};
  store: StoreOperation[] = [];

  constructor(public chain: Chainable, opts: AnyOpts = {}) {
    this.defaultOpts = opts;
  }

  resetStore() {
    this.store = [];
    return this;
  }

  addToStore(name: string, def: AnyOpts) {
    this.store.push({ name, def });
    return this;
  }

  addOpsToStore(ops: StoreOperation[]) {
    ops.map((op) => this.addToStore(op.name, op.def));
    return this;
  }

  applyStore() {
    this.store.map((op: StoreOperation) => {
      const { name, def } = op;
      const ctx = this as any;
      const fn = ctx[name].bind(ctx);
      fn(def);
    });
    return this;
  }

  get source() {
    return this.chain.source;
  }

  setDefaultOpts(opts: AnyOpts = {}) {
    this.defaultOpts = opts;
  }

  set source(src: string) {
    this.chain.source = src;
  }

  apply(modifyFn: ModifyApiFn, opts: any) {
    const src = modifyFn(this.source, {
      ...this.defaultOpts,
      ...opts,
    });
    if (src) {
      this.source = src;
    }
    return this;
  }
}
