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
  replaceClassPropertyInSource,
  ClassPropertyReplaceOptions,
  replaceImportIdInSource,
  ReplaceImportIdOptions,
  replaceInsideFunctionBlockInSource,
  ReplaceInsideFunctionBlockOptions,
} from './functions';

export const replaceApi = (source: string) => {
  return new ReplaceApi(source);
};

export class ReplaceApi extends BaseApi {
  constructor(source: string) {
    super(source);
  }

  inArray(opts: ReplaceArrayOptions): ReplaceApi {
    return this.apply(replaceInNamedArrayInSource, opts);
  }

  classDecorator(opts: ClassDecoratorReplaceOptions): ReplaceApi {
    return this.apply(replaceClassDecoratorInSource, opts);
  }

  classMethodParams(opts: ClassMethodParamReplaceOptions): ReplaceApi {
    return this.apply(replaceClassMethodParamsInSource, opts);
  }

  classMethod(opts: ClassMethodReplaceOptions): ReplaceApi {
    return this.apply(replaceClassMethodInSource, opts);
  }

  classProperty(opts: ClassPropertyReplaceOptions): ReplaceApi {
    return this.apply(replaceClassPropertyInSource, opts);
  }

  importIds(opts: ReplaceImportIdOptions): ReplaceApi {
    return this.apply(replaceImportIdInSource, opts);
  }

  inFunction(opts: ReplaceInsideFunctionBlockOptions): ReplaceApi {
    return this.apply(replaceInsideFunctionBlockInSource, opts);
  }

  inObject(opts: ReplaceObjectOptions): ReplaceApi {
    return this.apply(replaceInNamedObjectInSource, opts);
  }
}
