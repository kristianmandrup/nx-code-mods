import { idMatcher } from '../../../auto-name';

const context = describe;

describe('id matcher', () => {
  context('setAdmin', () => {
    const matcher = idMatcher('setAdminType');

    describe('words', () => {
      it('set, admin, type', () => {
        const words = matcher.words;
        expect(words).toContain(['set', 'type', 'admin']);
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
        expect(verbs).toEqual(['set', 'type']);
      });
    });

    describe('nouns', () => {
      it('type, admin', () => {
        const nouns = matcher.nouns;
        expect(nouns).toContain(['type', 'admin']);
      });
    });

    describe('prepositions', () => {
      it('empty', () => {
        const prepositions = matcher.prepositions;
        expect(prepositions).toContain([]);
      });
    });
  });
});
