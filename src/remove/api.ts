import { BaseApi, Chainable } from '../api';
import {
  removeFromNamedArrayInSource,
  RemoveArrayOptions,
  RemoveObjectOptions,
  removeFromNamedObjectInSource,
  removeClassDecoratorInSource,
  ClassDecoratorRemoveOptions,
  removeClassMethodParamDecoratorsInSource,
  ClassMethodParamDecoratorRemoveOptions,
  removeClassMethodParamsInSource,
  ClassMethodParamRemoveOptions,
  removeClassMethodInSource,
  ClassMethodRemoveOptions,
  removeClassPropertyInSource,
  ClassPropertyRemoveOptions,
  RemoveFunctionOptions,
  removeInsideFunctionBlockInSource,
  removeImportIdInSource,
  RemoveImportIdOptions,
  RemoveImportOptions,
  removeImportInSource,
} from './functions';

export const removeApi = (chain: Chainable): RemoveApi => {
  return new RemoveApi(chain);
};

export class RemoveApi extends BaseApi {
  constructor(chain: Chainable) {
    super(chain);
  }

  fromArray(opts: RemoveArrayOptions): RemoveApi {
    return this.apply(removeFromNamedArrayInSource, opts);
  }

  fromClassDecorator(opts: ClassDecoratorRemoveOptions): RemoveApi {
    return this.apply(removeClassDecoratorInSource, opts);
  }

  fromClassMethodParamDecorator(
    opts: ClassMethodParamDecoratorRemoveOptions,
  ): RemoveApi {
    return this.apply(removeClassMethodParamDecoratorsInSource, opts);
  }

  fromClassMethodParams(opts: ClassMethodParamRemoveOptions): RemoveApi {
    return this.apply(removeClassMethodParamsInSource, opts);
  }

  fromClassMethods(opts: ClassMethodRemoveOptions): RemoveApi {
    return this.apply(removeClassMethodInSource, opts);
  }
  fromClassProperties(opts: ClassPropertyRemoveOptions): RemoveApi {
    return this.apply(removeClassPropertyInSource, opts);
  }
  fromFunction(opts: RemoveFunctionOptions): RemoveApi {
    return this.apply(removeInsideFunctionBlockInSource, opts);
  }
  fromImport(opts: RemoveImportIdOptions): RemoveApi {
    return this.apply(removeImportIdInSource, opts);
  }
  import(opts: RemoveImportOptions): RemoveApi {
    return this.apply(removeImportInSource, opts);
  }
  fromObject(opts: RemoveObjectOptions): RemoveApi {
    return this.apply(removeFromNamedObjectInSource, opts);
  }
}
