export type ModifyApiFn = (src: string, opts: any) => string | undefined;

export class BaseApi {
  constructor(public source: string) {}

  apply(modifyFn: ModifyApiFn, opts: any) {
    const src = modifyFn(this.source, opts);
    if (src) {
      this.source = src;
    }
    return this;
  }
}
