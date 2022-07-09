import { GrammarMatcher } from './../grammar-matcher';
import { Statement } from 'typescript';
import { idMatcher } from '../id/id-matcher';
import { unique } from '../utils';
import { findNodeIds } from '../../find';

export const createStmtMatcher = (stmt: Statement, index: number) =>
  new StatementMatcher(stmt, index);

export type IdCountMap = {
  [key: string]: any;
};

export class StatementMatcher extends GrammarMatcher {
  constructor(public stmt: Statement, public index: number) {
    super();
    this.getCode();
    this.getIds();
    this.parseGrammar();
    this.findMatchedAndUnmatchedWords();
  }

  code: string = '';
  arrayOps: string[] = [];
  idCountMap: IdCountMap = {};

  getCode() {
    this.code = this.stmt.getFullText();
    return this;
  }

  getIds() {
    this.grammar.ids = unique(findNodeIds(this.stmt));
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

  findMatchedAndUnmatchedWords() {
    this.findMatchedWords();
    this.findUnmatchedWords();
  }

  findMatchedWords() {
    const matched = [
      ...this.adjectives,
      ...this.verbs,
      ...this.nouns,
      ...this.prepositions,
    ];
    this.grammar.matchedWords = unique(matched);
  }

  findUnmatchedWords() {
    if (this.matchedWords.length === 0) this.findMatchedWords();
    this.grammar.unmatchedWords = this.words.filter(
      (word) => !this.matchedWords.includes(word),
    );
  }
}
