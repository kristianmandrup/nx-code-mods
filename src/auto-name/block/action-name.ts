import { escapeRegExp } from '../../utils';
import { isNoun } from '../id-matcher';

const arrayOps: any = [
  'map',
  'reverse',
  'filter',
  'reduce',
  'find',
  'join',
  'fill',
  'slice',
  'sort',
  'group',
];

export const isSingularActionNoun = ({ action, id }: any) =>
  isSingularAction(action) && id && isNoun(id);

export const isSingularAction = (action: string) => {
  return actionPluralityMap[action];
};

const actionPluralityMap: any = {
  find: true,
};

export const findArrayActionAndId = ({
  ids,
  code,
}: {
  ids: string[];
  code: string;
}) => {
  let action, foundId;
  ids.find((id) => {
    const op = findArrayOp(id, code);
    if (op) {
      foundId = id;
      action = op;
    }
    return op;
  });

  if (!action) return;
  return {
    action,
    id: foundId,
  };
};

const findArrayOp = (id: string, stmtTxt: string) => {
  return arrayOps.find((op: string) => {
    const idExp = escapeRegExp(id);
    const opExp = escapeRegExp(op);
    const regExp = new RegExp(idExp + '.' + opExp + `\\s*\\(`);
    const matches = stmtTxt.match(regExp);
    return matches;
  });
};
