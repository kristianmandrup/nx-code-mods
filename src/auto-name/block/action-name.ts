import { escapeRegExp } from '../../utils';
import { isNoun } from './id-matcher';

const arrayOpsMap: any = {
  map: 'mapped',
  reverse: 'reversed',
  filter: 'filtered',
  reduce: 'reduced',
  find: 'find',
  join: 'joined',
  fill: 'filled',
  slice: 'sliced',
  sort: 'sorted',
  group: 'grouped',
};

export const isSingularActionNoun = ({ action, id }: any) =>
  isSingularAction(action) && id && isNoun(id);

export const isSingularAction = (action: string) => {
  return actionPluralityMap[action];
};

const actionPluralityMap: any = {
  find: true,
};

const arrayOps = Object.keys(arrayOpsMap);

export const findArrayActionAndId = ({
  ids,
  code,
}: {
  ids: string[];
  code: string;
}) => {
  let foundOp, foundId;
  ids.find((id) => {
    const op = findArrayOp(id, code);
    if (op) {
      foundId = id;
      foundOp = op;
    }
    return op;
  });

  if (!foundOp) return;
  const arrayOp = arrayOpsMap[foundOp];
  return {
    action: arrayOp,
    id: foundId,
  };
};

const findArrayOp = (id: string, stmtTxt: string) => {
  return arrayOps.find((op) => {
    const idExp = escapeRegExp(id);
    const opExp = escapeRegExp(op);
    const regExp = new RegExp(idExp + '.' + opExp + `\\s*\\(`);
    const matches = stmtTxt.match(regExp);
    return matches;
  });
};
