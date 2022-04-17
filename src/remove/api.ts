import { BaseApi, Chainable } from '../api';
import { AnyOpts } from '../modify';
import {
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

export const removeApi = (chain: Chainable): RemoveApi => {
  return new RemoveApi(chain);
};

export class RemoveApi extends BaseApi {
  constructor(chain: Chainable) {
    super(chain);
  }

  fromArray(opts: AnyOpts): RemoveApi {
    return this.apply(removeFromNamedArrayInSource, opts);
  }

  fromClassDecorator(opts: AnyOpts): RemoveApi {
    return this.apply(removeClassDecoratorInSource, opts);
  }

  fromClassMethodParamDecorator(opts: AnyOpts): RemoveApi {
    return this.apply(removeClassMethodParamDecoratorsInSource, opts);
  }

  fromClassMethodParams(opts: AnyOpts): RemoveApi {
    return this.apply(removeClassMethodParamsInSource, opts);
  }

  fromClassMethods(opts: AnyOpts): RemoveApi {
    return this.apply(removeClassMethodInSource, opts);
  }
  fromClassProperties(opts: AnyOpts): RemoveApi {
    return this.apply(removeClassPropertyInSource, opts);
  }
  fromFunction(opts: AnyOpts): RemoveApi {
    return this.apply(removeInsideFunctionBlockInSource, opts);
  }
  fromImport(opts: AnyOpts): RemoveApi {
    return this.apply(removeImportIdInSource, opts);
  }
  import(opts: AnyOpts): RemoveApi {
    return this.apply(removeImportInSource, opts);
  }
  fromObject(opts: AnyOpts): RemoveApi {
    return this.apply(removeFromNamedObjectInSource, opts);
  }
}
