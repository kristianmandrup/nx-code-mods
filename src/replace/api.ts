import { BaseApi } from '../api';
import {
  replaceInNamedObjectInSource,
  ReplaceObjectOptions,
  ClassDecoratorReplaceOptions,
  replaceClassDecoratorInSource,
  ReplaceArrayOptions,
  replaceInNamedArrayInSource,
  replaceClassMethodInSource,
  ClassMethodReplaceOptions,
  replaceClassMethodParamsInSource,
  ClassMethodParamReplaceOptions,
} from '.';

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

  inNamedArray(opts: ReplaceArrayOptions): ReplaceApi {
    return this.apply(replaceInNamedArrayInSource, opts);
  }

  classDecorator(opts: ClassDecoratorReplaceOptions): ReplaceApi {
    return this.apply(replaceClassDecoratorInSource, opts);
  }

  classMethod(opts: ClassMethodReplaceOptions): ReplaceApi {
    return this.apply(replaceClassMethodInSource, opts);
  }

  classMethodParams(opts: ClassMethodParamReplaceOptions): ReplaceApi {
    return this.apply(replaceClassMethodParamsInSource, opts);
  }
}
