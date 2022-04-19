import { BaseApi, Chainable } from '../api';
import { AnyOpts } from '../modify';
import {
  ApiRemoveImportIdOptions,
  ApiRemoveImportOptions,
  ApiRemoveFunctionOptions,
  ApiClassPropertyRemoveOptions,
  ApiClassMethodParamRemoveOptions,
  ApiClassDecoratorRemoveOptions,
  ApiRemoveArrayOptions,
  removeFromNamedArrayInSource,
  removeFromNamedObjectInSource,
  removeClassDecoratorInSource,
  removeClassMethodParamDecoratorsInSource,
  removeClassMethodParamsInSource,
  removeClassMethodInSource,
  removeClassPropertyInSource,
  removeInsideFunctionBlockInSource,
  removeImportIdInSource,
  removeImportInSource,
} from './functions';
import { ApiClassMethodParamDecoratorRemoveOptions } from './remove-class-method-param-decorator';
import { ApiClassMethodRemoveOptions } from './remove-class-method';

export const removeApi = (chain: Chainable): RemoveApi => {
  return new RemoveApi(chain);
};

export class RemoveApi extends BaseApi {
  constructor(chain: Chainable) {
    super(chain);
  }

  fromArray(opts: ApiRemoveArrayOptions): RemoveApi {
    return this.apply(removeFromNamedArrayInSource, opts);
  }

  fromClassDecorator(opts: ApiClassDecoratorRemoveOptions): RemoveApi {
    return this.apply(removeClassDecoratorInSource, opts);
  }

  fromClassMethodParamDecorator(
    opts: ApiClassMethodParamDecoratorRemoveOptions,
  ): RemoveApi {
    return this.apply(removeClassMethodParamDecoratorsInSource, opts);
  }

  fromClassMethodParams(opts: ApiClassMethodParamRemoveOptions): RemoveApi {
    return this.apply(removeClassMethodParamsInSource, opts);
  }

  fromClassMethod(opts: ApiClassMethodRemoveOptions): RemoveApi {
    return this.apply(removeClassMethodInSource, opts);
  }
  fromClassProperty(opts: ApiClassPropertyRemoveOptions): RemoveApi {
    return this.apply(removeClassPropertyInSource, opts);
  }
  fromFunction(opts: ApiRemoveFunctionOptions): RemoveApi {
    return this.apply(removeInsideFunctionBlockInSource, opts);
  }
  fromImport(opts: ApiRemoveImportOptions): RemoveApi {
    return this.apply(removeImportIdInSource, opts);
  }
  import(opts: ApiRemoveImportIdOptions): RemoveApi {
    return this.apply(removeImportInSource, opts);
  }
  fromObject(opts: AnyOpts): RemoveApi {
    return this.apply(removeFromNamedObjectInSource, opts);
  }
}
