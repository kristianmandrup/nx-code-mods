import { removeApi, RemoveApi } from '../remove';
import { insertApi, InsertApi } from '../insert';
import { replaceApi, ReplaceApi } from '../replace';

export const chainApi = (source: string) => {
  return new ChainApi(source);
};

export class ChainApi {
  constructor(public source: string) {}

  get insert(): InsertApi {
    return insertApi(this.source);
  }

  get remove(): RemoveApi {
    return removeApi(this.source);
  }

  get replace(): ReplaceApi {
    return replaceApi(this.source);
  }
}
