import { Statement } from 'typescript';
import { idMatcher } from '../id-matcher';
import { unique } from '../utils';
import { findNodeIds } from '../../find';

export const createStmtMatcher = (stmt: Statement) =>
  new StatementMatcher(stmt);

export class StatementMatcher {
  constructor(public stmt: Statement) {
    this.getCode();
    this.getIds();
    this.parseGrammar();
    this.findMatchedAndUnmatchedIds();
  }

  code: string = '';
  ids: string[] = [];

  unmatchedIds: string[] = [];
  matchedIds: string[] = [];
  nouns: string[] = [];
  verbs: string[] = [];
  adjectives: string[] = [];
  prepositions: string[] = [];
  arrayOps: string[] = [];
  idCountMap: any = {};

  getCode() {
    this.code = this.stmt.getFullText();
    return this;
  }

  getIds() {
    this.ids = unique(findNodeIds(this.stmt));
    return this;
  }

  addToCountMap(id: string) {
    this.idCountMap[id] = this.idCountMap[id] || 0;
    this.idCountMap[id] = this.idCountMap[id] + 1;
    return this;
  }

  parseGrammar() {
    this.ids.map((id: string) => {
      this.addToCountMap(id);
      const matcher = idMatcher(id);
      this.adjectives.push(...matcher.adjectives);
      this.verbs.push(...matcher.verbs);
      this.nouns.push(...matcher.nouns);
      this.prepositions.push(...matcher.prepositions);
    });
  }

  findMatchedAndUnmatchedIds() {
    this.findMatchedIds();
    this.findUnmatchedIds();
  }

  findMatchedIds() {
    const matched = [
      ...this.adjectives,
      ...this.verbs,
      ...this.nouns,
      ...this.prepositions,
    ];
    this.matchedIds = unique(matched);
  }

  findUnmatchedIds() {
    if (this.matchedIds.length === 0) this.findMatchedIds();
    this.unmatchedIds = this.ids.filter((id) => !this.matchedIds.includes(id));
  }
}
