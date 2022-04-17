import { Chainable } from './../api/chain';
import {
  insertClassMethodDecoratorInSource,
  insertClassDecoratorInSource,
  insertClassMethodParamDecoratorInSource,
  insertClassMethodInSource,
  insertImportInSource,
  insertInsideFunctionBlockInSource,
  insertIntoNamedArrayInSource,
  insertIntoNamedObjectInSource,
  insertClassPropertyInSource,
} from './functions';
import { BaseApi } from '../api';
import { AnyOpts } from '../modify';

export const insertApi = (chain: Chainable): InsertApi => {
  return new InsertApi(chain);
};

export class InsertApi extends BaseApi {
  constructor(chain: Chainable) {
    super(chain);
  }

  classDecorator(opts: AnyOpts): InsertApi {
    return this.apply(insertClassDecoratorInSource, opts);
  }

  classMethodDecorator(opts: AnyOpts): InsertApi {
    return this.apply(insertClassMethodDecoratorInSource, opts);
  }

  classMethodParamDecorator(opts: AnyOpts): InsertApi {
    return this.apply(insertClassMethodParamDecoratorInSource, opts);
  }

  classMethod(opts: AnyOpts): InsertApi {
    return this.apply(insertClassMethodInSource, opts);
  }

  classProperty(opts: AnyOpts): InsertApi {
    return this.apply(insertClassPropertyInSource, opts);
  }

  import(opts: AnyOpts): InsertApi {
    return this.apply(insertImportInSource, opts);
  }

  inFunction(opts: AnyOpts): InsertApi {
    return this.apply(insertInsideFunctionBlockInSource, opts);
  }

  inArray(opts: AnyOpts): InsertApi {
    return this.apply(insertIntoNamedArrayInSource, opts);
  }

  inObject(opts: AnyOpts): InsertApi {
    return this.apply(insertIntoNamedObjectInSource, opts);
  }
}
