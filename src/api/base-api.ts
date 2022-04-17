import { Chainable } from './chain';

export type ModifyApiFn = (src: string, opts: any) => string | undefined;

export class BaseApi implements Chainable {
  constructor(public chain: Chainable) {}

  get source() {
    return this.chain.source;
  }

  set source(src: string) {
    this.chain.source = src;
  }

  apply(modifyFn: ModifyApiFn, opts: any) {
    const src = modifyFn(this.source, opts);
    if (src) {
      this.source = src;
    }
    return this;
  }
}
