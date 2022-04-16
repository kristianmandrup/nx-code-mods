import {
  insertClassMethodDecoratorInSource,
  insertClassDecoratorInSource,
  ClassDecInsertOptions,
  ClassMethodDecInsertOptions,
} from '.';
import { BaseApi } from '../api';
import {
  insertClassMethodParamDecoratorInSource,
  ClassMethodDecParamDecoratorInsertOptions,
} from '../insert';

export const insertApi = (source: string) => {
  return new InsertApi(source);
};

export class InsertApi extends BaseApi {
  constructor(source: string) {
    super(source);
  }

  classDecorator(opts: ClassDecInsertOptions): InsertApi {
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
}
