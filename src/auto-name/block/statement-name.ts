import { Statement } from 'typescript';
import { idMatcher } from './id-matcher';
import { findNodeIds } from '../utils';

export const createStmtMatcher = (stmt: Statement) =>
  new StatementMatcher(stmt);

export class StatementMatcher {
  constructor(public stmt: Statement) {
    this.getCode();
    this.getIds();
    this.parseGrammar();
  }

  code: string = '';
  ids: string[] = [];

  nouns: string[] = [];
  verbs: string[] = [];
  adjectives: string[] = [];
  prepositions: string[] = [];
  arrayOps: string[] = [];

  getCode() {
    this.code = this.stmt.getFullText();
    return this;
  }

  getIds() {
    this.ids = findNodeIds(this.stmt);
    return this;
  }

  parseGrammar() {
    this.ids.map((id: string) => {
      const matcher = idMatcher(id);
      this.adjectives.push(...matcher.adjectives);
      this.verbs.push(...matcher.verbs);
      this.nouns.push(...matcher.nouns);
      this.prepositions.push(...matcher.prepositions);
    });
  }
}
