import { camelizedIdentifier, idToStr } from '../utils';
import { findAllIdentifiersFor } from '../../find/find';
import { BinaryExpression } from 'typescript';
import { ExpressionParser } from './expr-parser';

// readonly left: Expression;
// readonly operatorToken: BinaryOperatorToken;
// readonly right: Expression;

const tokenMap: any = {
  '==': 'is',
  '===': 'is',
  '!==': 'not',
  '!=': 'not',
  '!': 'not',
  '>': 'greater',
  '>=': 'greater',
  '<': 'greater',
  '<=': 'less',
  '&&': 'and',
  '||': 'or',
};

export const createBinaryExpressionParser = (expr: BinaryExpression) =>
  new BinaryExpressionParser(expr);

export class BinaryExpressionParser extends ExpressionParser {
  leftIds: string[] = [];
  rightIds: string[] = [];
  token: string = '';
  tokenName: string = '';

  constructor(public expr: BinaryExpression) {
    super(expr);
    this.findLeftIds();
    this.getTokenName();
    this.findRightIds();
  }

  name() {
    const parts = [...this.leftIds, this.tokenName, ...this.rightIds];
    return camelizedIdentifier(parts);
  }

  getTokenName() {
    this.getToken();
    this.tokenName = tokenMap[this.token];
    return this;
  }

  getToken() {
    this.token = this.expr.operatorToken.getFullText();
    return this;
  }

  findLeftIds() {
    this.leftIds = findAllIdentifiersFor(this.expr.left).map(idToStr);
    return this;
  }

  findRightIds() {
    this.rightIds = findAllIdentifiersFor(this.expr.left).map(idToStr);
    return this;
  }
}
