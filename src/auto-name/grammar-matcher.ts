export interface GrammarSet {
  ids: string[];
  unmatchedWords: string[];
  matchedWords: string[];
  words: string[];
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  prepositions: string[];
}

export class GrammarMatcher {
  grammar: GrammarSet = {
    ids: [],
    unmatchedWords: [],
    matchedWords: [],
    words: [],
    nouns: [],
    verbs: [],
    adjectives: [],
    prepositions: [],
  };

  get ids() {
    return this.grammar.ids;
  }

  get unmatchedWords() {
    return this.grammar.unmatchedWords;
  }

  get matchedWords() {
    return this.grammar.matchedWords;
  }

  get words() {
    return this.grammar.words;
  }

  get nouns() {
    return this.grammar.nouns;
  }

  get verbs() {
    return this.grammar.verbs;
  }

  get adjectives() {
    return this.grammar.adjectives;
  }

  get prepositions() {
    return this.grammar.prepositions;
  }
}
