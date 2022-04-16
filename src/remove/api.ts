import { removeFromNamedArrayInSource, RemoveArrayOptions } from '.';
import { BaseApi } from '../api';

export const removeApi = (source: string) => {
  return new RemoveApi(source);
};

export class RemoveApi extends BaseApi {
  constructor(source: string) {
    super(source);
  }

  fromNamedArray(opts: RemoveArrayOptions): RemoveApi {
    return this.apply(removeFromNamedArrayInSource, opts);
  }
}
