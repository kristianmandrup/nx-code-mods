import { idMatcher } from '../../../auto-name';

const context = describe;

describe('id matcher', () => {
  context('setAdmin', () => {
    const matcher = idMatcher('setAdminType');

    describe('words', () => {
      it('set, admin, type', () => {
        const words = matcher.words;
        expect(words).toEqual(['set', 'admin', 'type']);
      });
    });

    describe('adjectives', () => {
      it('empty', () => {
        const adjectives = matcher.adjectives;
        expect(adjectives).toEqual([]);
      });
    });

    describe('verbs', () => {
      it('set, type', () => {
        const verbs = matcher.verbs;
        expect(verbs).toEqual(['set']);
      });
    });

    describe('nouns', () => {
      it('set, admin, type', () => {
        const nouns = matcher.nouns;
        expect(nouns).toEqual(['admin', 'type']);
      });
    });

    describe('prepositions', () => {
      it('empty', () => {
        const prepositions = matcher.prepositions;
        expect(prepositions).toEqual([]);
      });
    });
  });
});
