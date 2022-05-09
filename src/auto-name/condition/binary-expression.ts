import { idMatcher } from '../id/id-matcher';
import { camelizedIdentifier } from '../utils';
import { findAllIdentifiersOrStringLiteralsFor, idToStr } from '../../find';
import { BinaryExpression } from 'typescript';
import { ExpressionParser } from './expr-parser';

// readonly left: Expression;
// readonly operatorToken: BinaryOperatorToken;
// readonly right: Expression;

const tokenMap: any = {
  // '-': 'sub',
  // '--': 'sub',
  // '+': 'add',
  // '++': 'add',
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

  fullNameParts() {
    return this.filter([...this.leftIds, this.tokenName, ...this.rightIds]);
  }

  leftNameParts() {
    return this.filter([this.tokenName, ...this.leftIds]);
  }

  partition() {
    const rawParts = this.noRightIds()
      ? this.leftNameParts()
      : this.fullNameParts();

    let parts: string[] = [];
    rawParts.map((id) => {
      const matcher = idMatcher(id);
      parts.push(...matcher.verbs, ...matcher.nouns);
    });
    this.parts = this.filter(parts);
    return this.parts;
  }

  name() {
    this.partition();
    const { parts } = this;
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
