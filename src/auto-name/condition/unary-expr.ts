// readonly operator: PrefixUnaryOperator;
// readonly operand: UnaryExpression;

import { PrefixUnaryExpression } from 'typescript';
import { findAllIdentifiersFor } from '../../find';
import { camelizedIdentifier, idToStr } from '../utils';
import { ExpressionParser } from './expr-parser';

const operatorMap: any = {
  '++': 'add',
  '--': 'sub',
  '!': 'not',
};

export const createUnaryExpressionParser = (expr: PrefixUnaryExpression) =>
  new UnaryExpressionParser(expr);

export class UnaryExpressionParser extends ExpressionParser {
  ids: string[] = [];
  operator: string = '';
  operatorName: string = '';

  constructor(public expr: PrefixUnaryExpression) {
    super(expr);
    this.findOperandIds();
    this.getOperator();
  }

  name() {
    const parts = [this.operatorName, ...this.ids];
    return camelizedIdentifier(parts);
  }

  getOperatorName() {
    this.getOperator();
    this.operator = operatorMap[this.operator];
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
