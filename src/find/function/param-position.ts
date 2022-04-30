import { ParameterDeclaration } from 'typescript';
import { endOfIndex, startOfIndex } from '../../positional';
import { ParamsPos } from './params';

export const findFirstParamPos = (
  param: ParameterDeclaration | ParamsPos | undefined,
) => {
  if (!param) return;
  const paramsPos = param as ParamsPos;
  if (paramsPos.pos) {
    return paramsPos.pos;
  }
  return startOfIndex(param as ParameterDeclaration);
};

export const findLastParamPos = (
  param: ParameterDeclaration | ParamsPos | undefined,
) => {
  if (!param) return;
  const paramsPos = param as ParamsPos;
  if (paramsPos.pos) {
    return paramsPos.end;
  }
  return endOfIndex(param as ParameterDeclaration);
};
