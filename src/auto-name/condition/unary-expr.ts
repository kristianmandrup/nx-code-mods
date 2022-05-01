// readonly operator: PrefixUnaryOperator;
// readonly operand: UnaryExpression;

import { PrefixUnaryExpression, SyntaxKind } from 'typescript';
import { findAllIdentifiersFor, idToStr } from '../../find';
import { camelizedIdentifier } from '../utils';
import { ExpressionParser } from './expr-parser';

const {
  PlusPlusToken,
  PlusToken,
  MinusToken,
  MinusMinusToken,
  ExclamationToken,
} = SyntaxKind;

export const operatorMap: any = {
  [PlusPlusToken]: 'add',
  [PlusToken]: 'add',
  [MinusToken]: 'sub',
  [MinusMinusToken]: 'sub',
  [ExclamationToken]: 'not',
};

export const createUnaryExpressionParser = (expr: PrefixUnaryExpression) =>
  new UnaryExpressionParser(expr);

export class UnaryExpressionParser extends ExpressionParser {
  ids: string[] = [];
  operator: any;
  operatorName: string = '';

  constructor(public expr: PrefixUnaryExpression) {
    super(expr);
    this.findOperandIds();
    this.getOperatorName();
  }

  name() {
    const parts = this.filter([this.operatorName, ...this.ids]);
    return camelizedIdentifier(parts);
  }

  getOperatorName() {
    this.getOperator();
    this.operatorName = operatorMap[this.operator];
    return this;
  }

  getOperator() {
    this.operator = this.expr.operator.toString();
    return this;
  }

  findOperandIds() {
    this.ids = findAllIdentifiersFor(this.expr.operand).map(idToStr);
    return this;
  }
}
