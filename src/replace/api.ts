import { replaceInNamedObjectInSource, ReplaceObjectOptions } from '.';
import { BaseApi } from '../api';

export const replaceApi = (source: string) => {
  return new ReplaceApi(source);
};

export class ReplaceApi extends BaseApi {
  constructor(source: string) {
    super(source);
  }

  inNamedObject(opts: ReplaceObjectOptions): ReplaceApi {
    return this.apply(replaceInNamedObjectInSource, opts);
  }
}
