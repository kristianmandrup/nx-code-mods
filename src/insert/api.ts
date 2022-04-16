import {
  insertClassMethodDecoratorInSource,
  insertClassDecoratorInSource,
  ClassDecoratorInsertOptions,
  ClassMethodDecInsertOptions,
  InsertObjectOptions,
  InsertArrayOptions,
  InsertFunctionOptions,
  InsertImportOptions,
  ClassMethodInsertOptions,
  insertClassMethodParamDecoratorInSource,
  ClassMethodDecParamDecoratorInsertOptions,
  insertClassMethodInSource,
  insertImportInSource,
  insertInsideFunctionBlockInSource,
  insertIntoNamedArrayInSource,
  insertIntoNamedObjectInSource,
  insertClassPropertyInSource,
  ClassPropertyInsertOptions,
} from './functions';
import { BaseApi } from '../api';

export const insertApi = (source: string) => {
  return new InsertApi(source);
};

export class InsertApi extends BaseApi {
  constructor(source: string) {
    super(source);
  }

  classDecorator(opts: ClassDecoratorInsertOptions): InsertApi {
    return this.apply(insertClassDecoratorInSource, opts);
  }

  classMethodDecorator(opts: ClassMethodDecInsertOptions): InsertApi {
    return this.apply(insertClassMethodDecoratorInSource, opts);
  }

  classMethodParamDecorator(
    opts: ClassMethodDecParamDecoratorInsertOptions,
  ): InsertApi {
    return this.apply(insertClassMethodParamDecoratorInSource, opts);
  }

  classMethod(opts: ClassMethodInsertOptions): InsertApi {
    return this.apply(insertClassMethodInSource, opts);
  }

  classProperty(opts: ClassPropertyInsertOptions): InsertApi {
    return this.apply(insertClassPropertyInSource, opts);
  }

  import(opts: InsertImportOptions): InsertApi {
    return this.apply(insertImportInSource, opts);
  }

  inFunction(opts: InsertFunctionOptions): InsertApi {
    return this.apply(insertInsideFunctionBlockInSource, opts);
  }

  inArray(opts: InsertArrayOptions): InsertApi {
    return this.apply(insertIntoNamedArrayInSource, opts);
  }

  inObject(opts: InsertObjectOptions): InsertApi {
    return this.apply(insertIntoNamedObjectInSource, opts);
  }
}
