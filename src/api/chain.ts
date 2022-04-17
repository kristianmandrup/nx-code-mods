import { removeApi, RemoveApi } from '../remove';
import { insertApi, InsertApi } from '../insert';
import { replaceApi, ReplaceApi } from '../replace';

export const chainApi = (source: string) => {
  return new ChainApi(source);
};

export interface Chainable {
  source: string;
}

export class ChainApi implements Chainable {
  constructor(public source: string) {}

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
