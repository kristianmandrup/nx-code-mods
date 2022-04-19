import {} from './replace-array-elements';
import { BaseApi, Chainable } from '../api';
import { AnyOpts } from '../modify';
import {
  replaceInNamedObjectInSource,
  ApiReplaceObjectOptions,
  ApiClassDecoratorReplaceOptions,
  replaceClassDecoratorInSource,
  ApiReplaceArrayOptions,
  replaceInNamedArrayInSource,
  replaceClassMethodInSource,
  ApiClassMethodReplaceOptions,
  replaceClassMethodParamsInSource,
  ApiClassMethodParamReplaceOptions,
  replaceClassPropertyInSource,
  ApiClassPropertyReplaceOptions,
  replaceImportIdInSource,
  ApiReplaceImportIdOptions,
  replaceInsideFunctionBlockInSource,
  ApiReplaceInsideFunctionBlockOptions,
} from './functions';
import {
  replaceClassMethodParamDecoratorsInSource,
  ApiClassMethodParamDecoratorReplaceOptions,
} from './replace-class-method-param-decorator';

export const replaceApi = (chain: Chainable): ReplaceApi => {
  return new ReplaceApi(chain);
};

export class ReplaceApi extends BaseApi {
  constructor(chain: Chainable) {
    super(chain);
  }

  inArray(opts: ApiReplaceArrayOptions): ReplaceApi {
    return this.apply(replaceInNamedArrayInSource, opts);
  }

  classDecorator(opts: ApiClassDecoratorReplaceOptions): ReplaceApi {
    return this.apply(replaceClassDecoratorInSource, opts);
  }

  classMethodParams(opts: ApiClassMethodParamReplaceOptions): ReplaceApi {
    return this.apply(replaceClassMethodParamsInSource, opts);
  }

  classMethodParamDecorators(
    opts: ApiClassMethodParamDecoratorReplaceOptions,
  ): ReplaceApi {
    return this.apply(replaceClassMethodParamDecoratorsInSource, opts);
  }

  classMethod(opts: ApiClassMethodReplaceOptions): ReplaceApi {
    return this.apply(replaceClassMethodInSource, opts);
  }

  classProperty(opts: ApiClassPropertyReplaceOptions): ReplaceApi {
    return this.apply(replaceClassPropertyInSource, opts);
  }

  importIds(opts: ApiReplaceImportIdOptions): ReplaceApi {
    return this.apply(replaceImportIdInSource, opts);
  }

  inFunction(opts: AnyOpts): ReplaceApi {
    return this.apply(replaceInsideFunctionBlockInSource, opts);
  }

  inObject(opts: ApiReplaceObjectOptions): ReplaceApi {
    return this.apply(replaceInNamedObjectInSource, opts);
  }
}
