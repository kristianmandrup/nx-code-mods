import { AnyOpts } from '../modify';
import { Chainable } from './chain';

export type ModifyApiFn = (src: string, opts: any) => string | undefined;

export class BaseApi implements Chainable {
  defaultOpts: AnyOpts = {};

  constructor(public chain: Chainable, opts: AnyOpts = {}) {
    this.defaultOpts = opts;
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
