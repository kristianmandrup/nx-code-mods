import { BaseApi, Chainable } from '../api';
import { AnyOpts } from '../modify';
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

export const replaceApi = (chain: Chainable): ReplaceApi => {
  return new ReplaceApi(chain);
};

export class ReplaceApi extends BaseApi {
  constructor(chain: Chainable) {
    super(chain);
  }

  inArray(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceInNamedArrayInSource, opts);
  }

  classDecorator(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceClassDecoratorInSource, opts);
  }

  classMethodParams(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceClassMethodParamsInSource, opts);
  }

  classMethod(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceClassMethodInSource, opts);
  }

  classProperty(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceClassPropertyInSource, opts);
  }

  importIds(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceImportIdInSource, opts);
  }

  inFunction(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceInsideFunctionBlockInSource, opts);
  }

  inObject(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceInNamedObjectInSource, opts);
  }
}
