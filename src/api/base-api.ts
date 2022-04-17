import { AnyOpts } from '../modify';
import { Chainable } from './chain';

export type ModifyApiFn = (src: string, opts: any) => string | undefined;

export class BaseApi implements Chainable {
  defaultOps: AnyOpts = {};

  constructor(public chain: Chainable) {}

  get source() {
    return this.chain.source;
  }

  setDefaultOpts(opts: AnyOpts = {}) {
    this.defaultOps = opts;
  }

  set source(src: string) {
    this.chain.source = src;
  }

  apply(modifyFn: ModifyApiFn, opts: any) {
    const src = modifyFn(this.source, {
      ...this.defaultOps,
      ...opts,
    });
    if (src) {
      this.source = src;
    }
    return this;
  }
}
