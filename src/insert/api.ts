import { Chainable } from './../api/chain';
import {
  ApiInsertObjectOptions,
  ApiInsertArrayOptions,
  ApiInsertFunctionOptions,
  ApiClassPropertyInsertOptions,
  ApiClassMethodInsertOptions,
  ApiClassMethodParamDecoratorInsertOptions,
  ApiClassMethodDecoratorInsertOptions,
  ApiClassDecoratorInsertOptions,
  ApiClassMethodParamsInsertOptions,
  insertClassMethodDecoratorInSource,
  insertClassDecoratorInSource,
  insertClassMethodParamDecoratorInSource,
  insertClassMethodInSource,
  insertClassMethodParameterInSource,
  insertImportInSource,
  insertInsideFunctionBlockInSource,
  insertIntoNamedArrayInSource,
  insertIntoNamedObjectInSource,
  insertClassPropertyInSource,
} from './functions';
import { BaseApi } from '../api';
import { AnyOpts } from '../modify';
import { ApiInsertImportOptions } from './insert-import-ids';

export const insertApi = (chain: Chainable, opts: AnyOpts = {}): InsertApi => {
  return new InsertApi(chain, {
    ...(chain.defaultOpts || {}),
    ...(opts || {}),
  });
};

export class InsertApi extends BaseApi {
  constructor(chain: Chainable, opts: AnyOpts = {}) {
    super(chain, opts);
  }

  classDecorator(opts: ApiClassDecoratorInsertOptions): InsertApi {
    return this.apply(insertClassDecoratorInSource, opts);
  }

  classMethodDecorator(opts: ApiClassMethodDecoratorInsertOptions): InsertApi {
    return this.apply(insertClassMethodDecoratorInSource, opts);
  }

  classMethodParamDecorator(
    opts: ApiClassMethodParamDecoratorInsertOptions,
  ): InsertApi {
    return this.apply(insertClassMethodParamDecoratorInSource, opts);
  }

  classMethod(opts: ApiClassMethodInsertOptions): InsertApi {
    return this.apply(insertClassMethodInSource, opts);
  }

  classMethodParams(opts: ApiClassMethodParamsInsertOptions): InsertApi {
    return this.apply(insertClassMethodParameterInSource, opts);
  }

  classProperty(opts: ApiClassPropertyInsertOptions): InsertApi {
    return this.apply(insertClassPropertyInSource, opts);
  }

  import(opts: ApiInsertImportOptions): InsertApi {
    return this.apply(insertImportInSource, opts);
  }

  inFunction(opts: ApiInsertFunctionOptions): InsertApi {
    return this.apply(insertInsideFunctionBlockInSource, opts);
  }

  inArray(opts: ApiInsertArrayOptions): InsertApi {
    return this.apply(insertIntoNamedArrayInSource, opts);
  }

  inObject(opts: ApiInsertObjectOptions): InsertApi {
    return this.apply(insertIntoNamedObjectInSource, opts);
  }
}
