import { camelizedIdentifier, idToStr } from '../utils';
import { findAllIdentifiersOrStringLiteralsFor } from '../../find';
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

  noRightIds() {
    return this.rightIds.length === 0;
  }

  noLeftIds() {
    return this.leftIds.length === 0;
  }

  name() {
    const parts = this.noRightIds()
      ? [this.tokenName, ...this.leftIds]
      : [...this.leftIds, this.tokenName, ...this.rightIds];
    return camelizedIdentifier(parts);
  }

  getTokenName() {
    this.getToken();
    this.tokenName = tokenMap[this.token];
    return this;
  }

  getToken() {
    this.token = this.expr.operatorToken.getFullText().trim();
    return this;
  }

  findLeftIds() {
    this.leftIds = findAllIdentifiersOrStringLiteralsFor(this.expr.left).map(
      idToStr,
    );
    return this;
  }

  findRightIds() {
    this.rightIds = findAllIdentifiersOrStringLiteralsFor(this.expr.right).map(
      idToStr,
    );
    return this;
  }
}
