export interface GrammarSet {
  ids: string[];
  unmatchedIds: string[];
  matchedIds: string[];
  words: string[];
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  prepositions: string[];
}

export class GrammarMatcher {
  grammar: GrammarSet = {
    ids: [],
    unmatchedIds: [],
    matchedIds: [],
    words: [],
    nouns: [],
    verbs: [],
    adjectives: [],
    prepositions: [],
  };

  get ids() {
    return this.grammar.ids;
  }

  get unmatchedIds() {
    return this.grammar.unmatchedIds;
  }

  get matchedIds() {
    return this.grammar.matchedIds;
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
