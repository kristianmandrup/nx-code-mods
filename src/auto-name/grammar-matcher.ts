export interface GrammarSet {
  words: string[];
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  prepositions: string[];
}

export class GrammarMatcher {
  grammar: GrammarSet = {
    words: [],
    nouns: [],
    verbs: [],
    adjectives: [],
    prepositions: [],
  };

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
